const { pick } = require('lodash');
const { Op } = require('sequelize');
const {
  AdvSearchTerm,
  AdvCampaign,
  AdvAdGroup,
  AdvTarget,
  AdvKeyword,
  AdvSearchTermRecord,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class SearchTermRepository extends AdvertisingRepository {
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
      group: ['AdvSearchTerm.advSearchTermId'],
      attributes: this.formatAttributes(attributes, true),
      where: {
        ...pick(where, this.getAttributes()),
      },
      include: [
        {
          model: AdvCampaign,
          attributes: [],
          where: {
            advProfileId: profileId,
            ...pick(filter, ['campaignType']),
          },
        },
      ],
    };

    if (search) {
      queryOptions.where.query = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Include target.
    if (include.includes('target')) {
      queryOptions.include.push({
        model: AdvTarget,
        attributes: ['advTargetId', 'bid', 'targetingText'],
      });

      queryOptions.group.push('AdvTarget.advTargetId');
    }

    // Include keyword.
    if (include.includes('keyword')) {
      queryOptions.include.push({
        model: AdvKeyword,
        attributes: ['advKeywordId', 'bid', 'keywordText', 'matchType'],
      });

      queryOptions.group.push('AdvKeyword.advKeywordId');
    }

    // Include adGroup.
    if (include.includes('adGroup')) {
      queryOptions.include.push({
        model: AdvAdGroup,
        attributes: ['name', 'defaultBid'],
      });

      queryOptions.group.push('AdvAdGroup.advAdGroupId');
    }

    // Include campaign.
    if (include.includes('campaign')) {
      queryOptions.include[0].attributes.push('name', 'advCampaignId');
      queryOptions.group.push('AdvCampaign.advCampaignId');
    }

    // Include records.
    if (
      this.attributesHasRecordDependency(attributes) ||
      this.sortHasRecordDependency(sort) ||
      having.length
    ) {
      let includeRecords = {
        model: AdvSearchTermRecord,
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
      const key = 'advSearchTermId';

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

module.exports = new SearchTermRepository(AdvSearchTerm);
