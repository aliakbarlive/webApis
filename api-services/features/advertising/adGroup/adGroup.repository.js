const { Op } = require('sequelize');
const { pick } = require('lodash');
const { AdvAdGroup, AdvCampaign, AdvAdGroupRecord } = require('@models');

const AdvertisingRepository = require('../advertising.repository');
const { CampaignRepository } = require('../campaign');

class AdGroupRepository extends AdvertisingRepository {
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
      group: ['AdvAdGroup.advAdGroupId'],
      attributes: this.formatAttributes(attributes, true),
      where: {
        ...pick(where, this.getAttributes()),
      },
      include: [
        {
          model: AdvCampaign,
          attributes: [],
          required: true,
          where: {
            advProfileId: profileId,
            ...pick(filter, CampaignRepository.getAttributes()),
          },
        },
      ],
    };

    if (search) {
      queryOptions.where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (filter.advAdGroupIds) {
      queryOptions.where.advAdGroupId = {
        [Op.in]: filter.advAdGroupIds,
      };
    }

    // Include campaign.
    if (include.includes('campaign')) {
      queryOptions.group.push('AdvCampaign.advCampaignId');

      queryOptions.include[0].attributes.push('name');
    }

    // Include records.
    if (
      this.attributesHasRecordDependency(attributes) ||
      this.sortHasRecordDependency(sort) ||
      having.length
    ) {
      let includeRecords = {
        model: AdvAdGroupRecord,
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
      const key = 'advAdGroupId';

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

  async findAllByAdGroupIds(adGroupIds) {
    return await super.findAll({
      attributes: ['advAdGroupId', 'name'],
      where: {
        advAdGroupId: {
          [Op.in]: adGroupIds,
        },
      },
    });
  }
}

module.exports = new AdGroupRepository(AdvAdGroup);
