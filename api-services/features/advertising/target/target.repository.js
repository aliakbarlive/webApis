const { pick } = require('lodash');
const { Op } = require('sequelize');
const {
  AdvCampaign,
  AdvAdGroup,
  AdvTarget,
  AdvTargetRecord,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class TargetRepository extends AdvertisingRepository {
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
      group: ['AdvTarget.advTargetId'],
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
      queryOptions.where.targetingText = {
        [Op.iLike]: `%${search}%`,
      };
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
        model: AdvTargetRecord,
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
    rows = rows.map((row) => row.toJSON());

    // Include Previous Data.
    if (
      include &&
      dateRange &&
      include.includes('previousData') &&
      this.attributesHasRecordDependency(attributes)
    ) {
      const key = 'advTargetId';

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
}

module.exports = new TargetRepository(AdvTarget);
