const { pick } = require('lodash');
const { Op, cast, literal } = require('sequelize');
const {
  AdvKeyword,
  AdvKeywordRecord,
  AdvMetric,
  AdvAdGroup,
  AdvCampaign,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class KeywordRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
  }

  /**
   * Find and count all by profileId.
   *
   * @param {bigint} profileId
   * @param {object} options
   * @returns {object}
   */
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
      include: [],
      distinct: true,
      subQuery: false,
      limit: pageSize,
      offset: pageOffset,
      order: this.formatSort(sort, true),
      group: ['AdvKeyword.advKeywordId'],
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

    if (search) {
      queryOptions.where.keywordText = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Include adGroup.
    if (include.includes('metricsRanking')) {
      const rankingAttributes = this.getMetricRankingAttributes(attributes);

      if (rankingAttributes.length) {
        queryOptions.attributes = [
          ...queryOptions.attributes,
          ...rankingAttributes,
        ];
      }
    }

    // Include adGroup.
    if (include.includes('adGroup')) {
      queryOptions.group.push(
        'AdvAdGroup.advAdGroupId',
        'AdvAdGroup->AdvCampaign.advCampaignId'
      );

      queryOptions.include[0].attributes.push('name', 'advAdGroupId');
      queryOptions.include[0].include.attributes.push('advCampaignId', 'name');
    }

    // Include records.
    if (
      this.attributesHasRecordDependency(attributes) ||
      this.sortHasRecordDependency(sort) ||
      having.length
    ) {
      let includeRecords = {
        model: AdvKeywordRecord,
        as: 'records',
        attributes: [],
        required: include.includes('metricsRanking'),
      };

      if (dateRange) {
        includeRecords.where = { date: this.dateRangeToQuery(dateRange) };
      }

      queryOptions.include.push(includeRecords);
    }

    let { rows, count } = await super.findAndCountAll(queryOptions);
    rows = rows.map((row) => row.toJSON());

    // Include Previous Data.
    if (
      include &&
      dateRange &&
      include.includes('previousData') &&
      this.attributesHasRecordDependency(attributes)
    ) {
      const key = 'advKeywordId';

      const previousRecords = await super.findAll(
        this.getPreviousDataOptions(
          queryOptions,
          rows.map((row) => row[key]),
          dateRange,
          key
        )
      );

      rows = rows.map((row) => {
        return {
          ...row,
          previousData: previousRecords.find(
            (record) => record[key] === row[key]
          ),
        };
      });
    }

    return { rows, count: count.length };
  }

  async findAndCountAllWithComparisonByProfileId(profileId, options) {
    const {
      pageSize,
      pageOffset,
      filter,
      dateRange: currentDateRange,
    } = options;

    const { attribute } = filter;

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
        'advKeywordId',
        'keywordText',
        'matchType',
        [cast(literal(previousQuery), attributeCast), 'previous'],
        [cast(literal(currentQuery), attributeCast), 'current'],
        [cast(literal(differenceQuery), attributeCast), 'difference'],
      ],
      include: [
        {
          model: AdvKeywordRecord,
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
                ...pick(filter, ['campaignType']),
              },
            },
          ],
        },
      ],
      subQuery: false,
      distinct: true,
      offset: pageOffset,
      limit: pageSize,
      group: ['AdvKeyword.advKeywordId'],
      order: [[literal(`ABS(${differenceQuery})`), 'DESC']],
    });

    return { rows, count: count.length };
  }

  async countWithImpressionsByProfileIdAndDateRange(profileId, dateRange) {
    const count = await super.count({
      subQuery: false,
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            impressions: {
              [Op.gt]: 0,
            },
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      ],
    });

    return count;
  }

  async countWithConvertersByProfileIdAndDateRange(profileId, dateRange) {
    const count = await super.count({
      subQuery: false,
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            sales: {
              [Op.gt]: 0,
            },
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      ],
    });

    return count;
  }

  async countWithOutConvertersByProfileIdAndDateRange(profileId, dateRange) {
    const count = await super.count({
      subQuery: false,
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            impressions: {
              [Op.gt]: 0,
            },
            sales: 0,
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      ],
    });

    return count;
  }

  async getMetricsFromWithImpressionsByProfileIdAndDateRange(
    profileId,
    dateRange,
    metrics
  ) {
    const attributes = await this.attributesToQueryStatement(metrics);

    const data = await super.findOne({
      attributes,
      subQuery: false,
      raw: true,
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            impressions: {
              [Op.gt]: 0,
            },
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      ],
    });

    return data;
  }

  async getMetricsFromConvertersByProfileIdAndDateRange(
    profileId,
    dateRange,
    metrics
  ) {
    const attributes = await this.attributesToQueryStatement(metrics);

    const data = await super.findOne({
      attributes,
      subQuery: false,
      raw: true,
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            sales: {
              [Op.gt]: 0,
            },
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      ],
    });

    return data;
  }

  async getMetricsFromNonConvertersByProfileIdAndDateRange(
    profileId,
    dateRange,
    metrics
  ) {
    const attributes = await this.attributesToQueryStatement(metrics);

    const data = await super.findOne({
      attributes,
      subQuery: false,
      raw: true,
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            impressions: {
              [Op.gt]: 0,
            },
            sales: 0,
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            right: true,
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      ],
    });

    return data;
  }

  async countWithSumMetrics(advProfileId, dateRange, filter) {
    const { having } = this.getFilterConditions(filter, true);

    const count = await super.count({
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: true,
          where: {
            date: {
              [Op.gte]: dateRange.startDate,
              [Op.lte]: dateRange.endDate,
            },
          },
        },
        {
          model: AdvAdGroup,
          attributes: [],
          right: true,
          required: true,
          include: {
            model: AdvCampaign,
            required: true,
            attributes: [],
            where: { advProfileId },
          },
        },
      ],
      group: ['AdvKeyword.advKeywordId'],
      having,
    });

    return count.length;
  }

  async findOneWithRankingByProfileIdAndId(advProfileId, keywordId, options) {
    const { attributes } = options;

    const formattedAttributes = super.formatAttributes(attributes);

    const data = await super.findById(keywordId, {
      attributes: {
        include: [...formattedAttributes],
      },
      include: [
        {
          model: AdvKeywordRecord,
          as: 'records',
          attributes: [],
          required: false,
          // where: {
          //   date: {
          //     [Op.gte]: dateRange.startDate,
          //     [Op.lte]: dateRange.endDate,
          //   },
          // },
        },
        {
          model: AdvAdGroup,
          attributes: [],
          right: true,
          required: true,
          include: {
            model: AdvCampaign,
            required: true,
            attributes: [],
            where: { advProfileId },
          },
        },
      ],
      group: ['AdvKeyword.advKeywordId'],
    });

    return data;
  }
}

module.exports = new KeywordRepository(AdvKeyword);
