const { pick } = require('lodash');
const { Op, cast, literal } = require('sequelize');
const {
  AdvMetric,
  AdvAdGroup,
  AdvCampaign,
  AdvTargeting,
  AdvTargetingRecord,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class TargetingRepository extends AdvertisingRepository {
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

    let { where, having } = this.getFilterConditions(filter, true);

    let queryOptions = {
      having,
      include: [],
      distinct: true,
      subQuery: false,
      limit: pageSize,
      offset: pageOffset,
      order: this.formatSort(sort, true),
      group: ['AdvTargeting.advTargetingId'],
      attributes: this.formatAttributes(attributes, true),
      where: pick(where, this.getAttributes()),
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
      queryOptions.where.value = {
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
        model: AdvTargetingRecord,
        as: 'records',
        attributes: [],
        required: true,
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
      const key = 'advTargetingId';

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

  async countWithImpressionsByProfileIdAndDateRange(profileId, dateRange) {
    const count = await super.count({
      subQuery: false,
      include: [
        {
          model: AdvTargetingRecord,
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
          model: AdvTargetingRecord,
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
          model: AdvTargetingRecord,
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
          model: AdvTargetingRecord,
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
          model: AdvTargetingRecord,
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
          model: AdvTargetingRecord,
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
          model: AdvTargetingRecord,
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
      group: ['AdvTargeting.advTargetingId'],
      having,
    });

    return count.length;
  }
}

module.exports = new TargetingRepository(AdvTargeting);
