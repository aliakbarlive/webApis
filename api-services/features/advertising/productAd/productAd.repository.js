const { pick } = require('lodash');
const { Op, cast, literal } = require('sequelize');
const {
  Listing,
  AdvProfile,
  AdvMetric,
  AdvAdGroup,
  AdvCampaign,
  AdvProductAd,
  AdvProductAdRecord,
  InventoryItem,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class ProductAdRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
  }

  async findAllByIds(ids) {
    return await super.findAll({
      attributes: ['advProductAdId', 'asin', 'sku'],
      where: {
        advProductAdId: {
          [Op.in]: ids,
        },
      },
    });
  }

  async findAndCountAllByProfileId(profileId, options) {
    let {
      page,
      sort,
      scope,
      search,
      include,
      pageSize,
      dateRange,
      attributes,
      pageOffset,
      ...filter
    } = options;

    const { where, having } = this.getFilterConditions(filter, true);

    let queryOptions = {
      having,
      raw: true,
      include: [],
      distinct: true,
      subQuery: false,
      limit: pageSize,
      offset: pageOffset,
      order: this.formatSort(sort, true),
      group: ['AdvProductAd.asin', 'AdvProductAd.sku'],
      attributes: this.formatAttributes(attributes, true),
      where: {
        ...pick(where, this.getAttributes()),
      },
      include: [
        {
          model: AdvAdGroup,
          attributes: [],
          right: true,
          required: true,
          include: {
            model: AdvCampaign,
            attributes: [],
            where: {
              advProfileId: profileId,
              ...pick(filter, ['campaignType']),
            },
          },
        },
      ],
    };

    if (filter.advCampaignIds && filter.advCampaignIds.length) {
      queryOptions.include[0].include.where.advCampaignId = {
        [Op.in]: filter.advCampaignIds,
      };
    }

    if (filter.advPortfolioIds && filter.advPortfolioIds.length) {
      queryOptions.include[0].include.where.advPortfolioId = {
        [Op.in]: filter.advPortfolioIds,
      };
    }

    if (search) {
      queryOptions.where = {
        ...queryOptions.where,
        [Op.or]: [
          { asin: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    // Include records.
    if (
      this.attributesHasRecordDependency(attributes) ||
      this.sortHasRecordDependency(sort) ||
      having.length
    ) {
      let includeRecords = {
        model: AdvProductAdRecord,
        as: 'records',
        attributes: [],
        required: false,
      };

      if (dateRange) {
        includeRecords.where = { date: this.dateRangeToQuery(dateRange) };
      }

      queryOptions.include.push(includeRecords);
    }

    let { rows, count } = await super.findAndCountAll(queryOptions);

    rows = rows.map((row, index) => {
      return { ...row, index, listing: {} };
    });

    // Include Previous Data.
    if (
      include &&
      dateRange &&
      include.includes('previousData') &&
      this.attributesHasRecordDependency(attributes)
    ) {
      let prevOptions = this.getPreviousDataOptions(
        queryOptions,
        rows.map((row) => row.sku),
        dateRange,
        'sku'
      );

      const previousRecords = await super.findAll({
        ...prevOptions,
        attributes: [...prevOptions.attributes, 'asin'],
        where: {
          [Op.or]: rows.map((row) => {
            return { asin: row.asin, sku: row.sku };
          }),
        },
        group: ['AdvProductAd.asin', 'AdvProductAd.sku'],
        raw: true,
      });

      rows = rows.map((row) => {
        return {
          ...row,
          previousData: previousRecords.find(
            (productAd) =>
              productAd.asin === row.asin && productAd.sku === row.sku
          ),
        };
      });
    }

    if (include.includes('listing') && count) {
      const { accountId, marketplaceId } = await AdvProfile.findByPk(profileId);

      let inventoryWhereOptions = { accountId, marketplaceId, [Op.or]: [] };

      const skus = rows.filter((row) => row.sku).map((row) => row.sku);
      const asins = rows.filter((row) => row.asin).map((row) => row.asin);

      if (skus.length) {
        inventoryWhereOptions[Symbol.for('or')].push({
          sellerSku: { [Op.in]: skus },
        });
      }

      if (asins.length) {
        inventoryWhereOptions[Symbol.for('or')].push({
          asin: { [Op.in]: asins },
        });
      }

      const inventories = await InventoryItem.findAll({
        attributes: ['asin', 'sellerSku'],
        where: inventoryWhereOptions,
        include: {
          model: Listing,
          attributes: ['thumbnail', 'title'],
        },
      });

      rows = rows.map((row) => {
        const inventory = inventories.find(
          ({ asin, sellerSku }) => asin === row.asin || sellerSku === row.sku
        );

        if (inventory) {
          row.listing = {
            sku: inventory.sellerSku,
            asin: inventory.asin,
            title: inventory.Listing.title,
            thumbnail: inventory.Listing.thumbnail,
          };
        }

        return row;
      });
    }

    return { rows, count: count.length };
  }

  async findAndCountAllWithComparisonByProfileId(profileId, options) {
    const {
      pageSize,
      pageOffset,
      attribute,
      dateRange: currentDateRange,
    } = options;

    const previousDateRange = this.getPreviousDateRange(currentDateRange);

    const metric = await AdvMetric.findOne({
      where: { name: attribute },
    });

    const { query, dependencies, name, cast: attributeCast } = metric;

    const variables = dependencies ? [...dependencies.split(',')] : [name];

    let previousQuery = query;
    let currentQuery = query;

    variables.forEach((variable) => {
      previousQuery = previousQuery
        .split(`records."${variable}"`)
        .join(
          `CASE WHEN "date" < '${currentDateRange.startDate}' THEN "${variable}" ELSE 0 END`
        );

      currentQuery = currentQuery
        .split(`records."${variable}"`)
        .join(
          `CASE WHEN "date" > '${previousDateRange.endDate}' THEN "${variable}" ELSE 0 END`
        );
    });

    const differenceQuery = `${currentQuery} - ${previousQuery}`;

    let { rows, count } = await this.model.findAndCountAll({
      attributes: [
        'asin',
        'sku',
        [cast(literal(previousQuery), attributeCast), 'previous'],
        [cast(literal(currentQuery), attributeCast), 'current'],
        [cast(literal(differenceQuery), attributeCast), 'difference'],
      ],
      include: [
        {
          model: AdvProductAdRecord,
          as: 'records',
          attributes: [],
          required: false,
          where: {
            date: {
              [Op.gte]: previousDateRange.startDate,
              [Op.lte]: currentDateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          attributes: [],
          right: true,
          required: true,
          include: [
            {
              model: AdvCampaign,
              attributes: [],
              right: true,
              where: {
                advProfileId: profileId,
              },
            },
          ],
        },
      ],
      subQuery: false,
      offset: pageOffset,
      limit: pageSize,
      group: ['AdvProductAd.asin', 'AdvProductAd.sku'],
      raw: true,
      order: [[literal(`ABS(${differenceQuery})`), 'DESC']],
    });

    rows = rows.map((row, index) => {
      return { ...row, index, listing: {} };
    });

    count = count.length;
    if (count) {
      const { accountId, marketplaceId } = await AdvProfile.findByPk(profileId);

      let inventoryWhereOptions = { accountId, marketplaceId, [Op.or]: [] };

      const skus = rows.filter((row) => row.sku).map((row) => row.sku);
      const asins = rows.filter((row) => row.asin).map((row) => row.asin);

      if (skus.length) {
        inventoryWhereOptions[Symbol.for('or')].push({
          sellerSku: { [Op.in]: skus },
        });
      }

      if (asins.length) {
        inventoryWhereOptions[Symbol.for('or')].push({
          asin: { [Op.in]: asins },
        });
      }

      const inventories = await InventoryItem.findAll({
        attributes: ['asin', 'sellerSku'],
        where: inventoryWhereOptions,
        include: {
          model: Listing,
          attributes: ['thumbnail', 'title'],
        },
      });

      rows = rows.map((row) => {
        const inventory = inventories.find(
          ({ asin, sellerSku }) => asin === row.asin || sellerSku === row.sku
        );

        if (inventory) {
          row.listing = {
            sku: inventory.sellerSku,
            asin: inventory.asin,
            title: inventory.Listing.title,
            thumbnail: inventory.Listing.thumbnail,
          };
        }

        return row;
      });
    }

    return { rows, count };
  }
}

module.exports = new ProductAdRepository(AdvProductAd);
