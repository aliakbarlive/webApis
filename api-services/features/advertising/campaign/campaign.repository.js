const { pick } = require('lodash');
const { Op, cast, literal } = require('sequelize');

const {
  AdvMetric,
  AdvCampaign,
  AdvPortfolio,
  AdvCampaignRecord,
  AdvCampaignBudgetRecommendation,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class CampaignRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
  }

  async findAllByCampaignIds(campaignIds) {
    return await super.findAll({
      attributes: ['advCampaignId', 'name'],
      where: {
        advCampaignId: {
          [Op.in]: campaignIds,
        },
      },
    });
  }

  /**
   * Find Campaign by profileId and campaignId
   *
   * @param {bigint} profileId
   * @param {bigint} campaignId
   * @returns {Promise<AdvCampaign>} campaign
   */
  async findByProfileIdAndId(profileId, campaignId) {
    const campaign = await this.model.findOne({
      where: {
        advProfileId: profileId,
        advCampaignId: campaignId,
      },
    });

    return campaign;
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
      group: ['AdvCampaign.advCampaignId'],
      attributes: this.formatAttributes(attributes, true),
      where: {
        advProfileId: profileId,
        ...pick(where, this.getAttributes()),
      },
    };

    if (filter.advPortfolioIds && filter.advPortfolioIds.length) {
      queryOptions.where.advPortfolioId = {
        [Op.in]: filter.advPortfolioIds,
      };
    }

    if (search) {
      queryOptions.where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Include records.
    if (
      this.attributesHasRecordDependency(attributes) ||
      this.sortHasRecordDependency(sort) ||
      having.length
    ) {
      let includeRecords = {
        model: AdvCampaignRecord,
        as: 'records',
        attributes: [],
        required: false,
      };

      if (dateRange) {
        includeRecords.where = { date: this.dateRangeToQuery(dateRange) };
      }

      queryOptions.include.push(includeRecords);
    }

    // Include portfolio.
    if (include.includes('portfolio')) {
      queryOptions.group.push('AdvPortfolio.advPortfolioId');

      queryOptions.include.push({
        model: AdvPortfolio,
        attributes: ['name'],
      });
    }

    // Include Budget Recommendation.
    if (include && include.includes('budgetRecommendation')) {
      queryOptions.group.push(
        'budgetRecommendation.advCampaignBudgetRecommendationId'
      );
      queryOptions.include.push({
        model: AdvCampaignBudgetRecommendation,
        as: 'budgetRecommendation',
        attributes: ['suggestedBudget'],
        required: scope.includes('withBudgetRecommendation'),
      });
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
      const key = 'advCampaignId';

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

    return { rows, count: Array.isArray(count) ? count.length : count };
  }

  /**
   * Find campaigns by ids and with budget recommendations.
   *
   * @param {array<bigint>} campaignIds
   * @returns {Promise} campaigns
   */
  async findByProfileIdCampaignTypeAndIdsWithBudgetRecommendation(
    profileId,
    campaignType,
    campaignIds
  ) {
    const campaigns = await this.model.findAll({
      attributes: ['advCampaignId'],
      where: {
        campaignType,
        advProfileId: profileId,
        advCampaignId: {
          [Op.in]: campaignIds,
        },
      },
      include: {
        model: AdvCampaignBudgetRecommendation,
        attributes: ['suggestedBudget'],
        as: 'budgetRecommendation',
        required: true,
      },
    });

    return campaigns;
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

    const { rows, count } = await this.model.findAndCountAll({
      attributes: [
        'advCampaignId',
        'name',
        'campaignType',
        [cast(literal(previousQuery), attributeCast), 'previous'],
        [cast(literal(currentQuery), attributeCast), 'current'],
        [cast(literal(differenceQuery), attributeCast), 'difference'],
      ],
      where: {
        advProfileId: profileId,
      },
      include: [
        {
          model: AdvCampaignRecord,
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
      ],
      distinct: true,
      subQuery: false,
      offset: pageOffset,
      limit: pageSize,
      group: ['AdvCampaign.advCampaignId'],
      order: [[literal(`ABS(${differenceQuery})`), 'DESC']],
    });

    return { rows, count: count.length };
  }

  async count(conditions = {}) {
    const count = await super.count({ where: conditions });

    return count;
  }

  async countActive(conditions = {}) {
    const count = await super.count({
      where: {
        ...conditions,
        servingStatus: {
          [Op.in]: ['CAMPAIGN_STATUS_ENABLED', 'running'],
        },
      },
    });

    return count;
  }
}

module.exports = new CampaignRepository(AdvCampaign);
