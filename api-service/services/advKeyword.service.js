const { Op } = require('sequelize');
const { pick } = require('lodash');
const { AdvProductAd } = require('../models');
const moment = require('moment');

const KEY = 'advKeywordId';

const {
  generatePrevOptions,
  generatePrevDateRange,
  transformAdvertisingListQuery,
  filterWithBidUpdatedAtInDays,
} = require('./advertising.service');

const {
  getAdvRulesByIds,
  getAdvRuleCondition,
  assertRuleConditionMatched,
} = require('./advRule.service');

const {
  AdvKeyword,
  findAllAdvKeyword,
  advKeywordAttributes,
  advKeywordRecordModel,
  findAndCountAllAdvKeyword,
} = require('../repositories/advKeyword.repository');

const {
  AdvCampaign,
  advCampaignAttributes,
} = require('../repositories/advCampaign.repository');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const { AdvAdGroup } = require('../repositories/advAdGroup.repository');

/**
 * Get list of advKeywords associated to advProfileId
 *
 * @param {bigint} advProfileId
 * @param {objec} query
 * @returns {object} list
 */
const getAdvKeywords = async (advProfileId, query, raw = false) => {
  const { page, pageSize = null, pageOffset = null, include } = query;
  let rules = [];
  let ruleAdGroups = {};

  // Filtering based on rules.
  if ('rules' in query.filter) {
    rules = query.filter.rules;

    query.filter.conditions = await Promise.all(
      rules.map(async (rule) => {
        let condition = await getAdvRuleCondition(rule);

        if (rule.portfolios.length) {
          condition['AdvAdGroup->AdvCampaign.advPortfolioId'] = {
            [Op.in]: rule.portfolios.map(
              ({ advPortfolioId }) => advPortfolioId
            ),
          };
        }

        if (rule.campaigns.length) {
          condition['AdvAdGroup->AdvCampaign.advCampaignId'] = {
            [Op.in]: rule.campaigns.map(({ advCampaignId }) => advCampaignId),
          };
        }

        if (rule.products.length) {
          const productAds = await AdvProductAd.findAll({
            attributes: ['advAdGroupId'],
            where: {
              [Op.and]: rule.products.map(({ sku, asin }) => {
                return { asin, sku };
              }),
            },
            group: ['advAdGroupId'],
          });

          ruleAdGroups[rule.advRuleId] = productAds.map((p) => p.advAdGroupId);

          condition['AdvAdGroup.advAdGroupId'] = {
            [Op.in]: ruleAdGroups[rule.advRuleId],
          };
        }
        return condition;
      })
    );
  }

  let { filter, attributes, sort, having, dateRange } =
    await transformAdvertisingListQuery(query);

  if ('bidUpdatedAtInDays' in filter) {
    having.push(filterWithBidUpdatedAtInDays(filter.bidUpdatedAtInDays));
    delete filter.bidUpdatedAtInDays;
  }

  let options = {
    distinct: true,
    subQuery: false,
    attributes,
    where: pick(filter, [...advKeywordAttributes, Op.and]),
    include: [
      {
        model: advKeywordRecordModel,
        as: 'records',
        attributes: [],
        where: dateRange,
        required: false,
      },
      {
        model: AdvAdGroup,
        attributes: ['name'],
        right: true,
        required: true,
        include: [
          {
            model: AdvCampaign,
            attributes: ['name', 'advCampaignId', 'advPortfolioId'],
            where: {
              advProfileId,
              ...pick(filter, advCampaignAttributes),
            },
          },
        ],
      },
    ],
    group: [
      'AdvKeyword.advKeywordId',
      'AdvAdGroup.advAdGroupId',
      'AdvAdGroup->AdvCampaign.advCampaignId',
    ],
    order: sort,
    having,
    limit: pageSize,
    offset: pageOffset,
    raw,
  };

  if (query.search) {
    options.where.keywordText = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  let { rows, count } = await findAndCountAllAdvKeyword(options);

  rows = rows.map((row) => row.toJSON());

  if (include && include.includes('previousData')) {
    const prevDateRange = generatePrevDateRange(query.dateRange);
    const prevOptions = generatePrevOptions(options, rows, prevDateRange, KEY);

    const keywords = await findAllAdvKeyword(prevOptions);

    rows = rows.map((row) => {
      return {
        ...row,
        previousDataDateRange: prevDateRange,
        previousData: keywords.find((keyword) => keyword[KEY] === row[KEY]),
      };
    });
  }

  if (rules.length) {
    rows = rows.map((row) => {
      const rulesTriggered = rules
        .filter((rule) => {
          const { advRuleId, filters, campaigns, portfolios } = rule;
          let portfolioMatch = true;
          let campaignMatch = true;
          let adGroupMatch = true;
          const filtersMatch = filters.every(({ ...filter }) => {
            filter.value = filter.value === 'cpc' ? row.cpc : filter.value;

            return assertRuleConditionMatched(
              filter,
              row[filter.attribute],
              filter.attribute === 'bidUpdatedAtInDays'
            );
          });

          if (campaigns.length) {
            campaignMatch = !!campaigns.find(
              ({ advCampaignId }) =>
                advCampaignId === row.AdvAdGroup.AdvCampaign.advCampaignId
            );
          }

          if (portfolios.length) {
            portfolioMatch = !!portfolios.find(
              ({ advPortfolioId }) =>
                advPortfolioId === row.AdvAdGroup.AdvCampaign.advPortfolioId
            );
          }

          if (advRuleId in ruleAdGroups) {
            adGroupMatch = ruleAdGroups[advRuleId].includes(row.advAdGroupId);
          }

          return (
            filtersMatch && campaignMatch && adGroupMatch && portfolioMatch
          );
        })
        .map((rule) => rule.advOptimizationReportRuleId);

      return { ...row, reportRules: rulesTriggered };
    });
  }

  return { page, pageSize, count: count.length, rows };
};

const getAdvKeywordsByIds = async (advKeywordIds) => {
  const keywords = await findAllAdvKeyword({
    where: {
      advKeywordId: { [Op.in]: advKeywordIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return keywords;
};

const bulkSyncAdvKeywords = async (
  advProfileId,
  campaignType,
  keywords,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!keywords.length) return;
  let recentlyUpdatedKeywords = [];
  let recentlyUpdatedKeywordIds = [];

  const records = keywords.map((keyword) => {
    let obj = {
      ...keyword,
      matchType: keyword.matchType.toLowerCase(),
      advAdGroupId: keyword.adGroupId,
      advKeywordId: keyword.keywordId,
      syncAt: new Date(),
    };

    if ('creationDate' in keyword && 'lastUpdatedDate' in keyword) {
      obj.createdAt = new Date(keyword.creationDate);
      obj.updatedAt = new Date(keyword.lastUpdatedDate);
    }

    return pick(obj, advKeywordAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedKeywordIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advKeywordId);

    if (recentlyUpdatedKeywordIds.length) {
      recentlyUpdatedKeywords = await getAdvKeywordsByIds(
        recentlyUpdatedKeywordIds
      );
    }
  }

  await AdvKeyword.bulkCreate(records, {
    updateOnDuplicate: advKeywordAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedKeywordIds.length) {
    const newlyUpdatedKeywords = await getAdvKeywordsByIds(
      recentlyUpdatedKeywordIds
    );

    for (const newData of newlyUpdatedKeywords) {
      const { advKeywordId, advAdGroupId, updatedAt } = newData;
      const advCampaignId = keywords.find(
        (k) => k.keywordId.toString() === advKeywordId.toString()
      ).campaignId;

      const saved = await checkIfChangesAlreadySaved({
        advKeywordId,
        recordType: 'keyword',
        activityDate: updatedAt,
      });

      let advOptimizationBatchId = null;
      let activityDate = updatedAt;

      if (optimization) {
        advOptimizationBatchId = optimization.batch.advOptimizationBatchId;
        activityDate = optimization.batch.processedAt;
      }

      if (!saved) {
        await saveChanges(
          advProfileId,
          campaignType,
          activityDate,
          userId,
          advOptimizationBatchId,
          {
            advKeywordId,
            advAdGroupId,
            advCampaignId,
            recordType: 'keyword',
            activityDate: updatedAt,
            previousData: recentlyUpdatedKeywords.find(
              (a) => a.advKeywordId === advKeywordId
            ),
            advOptimizationId: optimization
              ? optimization.advOptimizationId
              : null,
            newData,
          }
        );
      }
    }
  }
};

module.exports = { getAdvKeywords, bulkSyncAdvKeywords };
