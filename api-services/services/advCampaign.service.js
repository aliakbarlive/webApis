const { Op } = require('sequelize');
const { pick, keys } = require('lodash');

const { AdvProductAd, AdvAdGroup } = require('../models');

const {
  AdvCampaign,
  AdvCampaignRecord,
  AdvCampaignBudgetRecommendation,
  advCampaignAttributes,
} = require('../repositories/advCampaign.repository');

const { currencyFormatter } = require('../utils/formatters');

const KEY = 'advCampaignId';

const {
  generatePrevOptions,
  generatePrevDateRange,
  transformAdvertisingListQuery,
  transformAdvertisingRecordsQuery,
  transformAdvertisingStatisticsQuery,
} = require('./advertising.service');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const { paginate } = require('./pagination.service');

const {
  getAdvRuleCondition,
  assertRuleConditionMatched,
} = require('./advRule.service');

/**
 * Get advertising campaigns by advProfileId.
 * @param {bigint} advProfileId
 * @param {object} query
 * @returns [<AdvCampaign>]
 */
const getAdvCampaigns = async (advProfileId, query, raw = false) => {
  const { pageSize: limit = null, pageOffset: offset = null, include } = query;
  let rules = [];
  let ruleProductCampaigns = {};

  // Filtering based on rules.
  if ('rules' in query.filter) {
    rules = query.filter.rules;

    query.filter.conditions = await Promise.all(
      rules.map(async (rule) => {
        let condition = await getAdvRuleCondition(rule);

        if (rule.portfolios.length) {
          condition['advPortfolioId'] = {
            [Op.in]: rule.portfolios.map(
              ({ advPortfolioId }) => advPortfolioId
            ),
          };
        }

        if (rule.products.length) {
          const productCampaigns = await AdvCampaign.findAll({
            attributes: ['advCampaignId'],
            where: { advProfileId, campaignType: 'sponsoredProducts' },
            include: {
              model: AdvAdGroup,
              attributes: [],
              required: true,
              include: {
                model: AdvProductAd,
                attributes: [],
                required: true,
                where: {
                  [Op.and]: rule.products.map(({ sku, asin }) => {
                    return { asin, sku };
                  }),
                },
              },
            },
            group: ['AdvCampaign.advCampaignId'],
          });

          ruleProductCampaigns[rule.advRuleId] = productCampaigns.map(
            (c) => c.advCampaignId
          );

          condition['AdvCampaign.advCampaignId'] = {
            [Op.in]: ruleProductCampaigns[rule.advRuleId],
          };
        }

        if (rule.campaigns.length) {
          condition['AdvCampaign.advCampaignId'] = {
            [Op.in]: rule.campaigns.map(({ advCampaignId }) => advCampaignId),
          };
        }

        return condition;
      })
    );
  }

  const { attributes, sort, having, dateRange, filter } =
    await transformAdvertisingListQuery(query);

  let options = {
    where: { advProfileId, ...pick(filter, keys(AdvCampaign.rawAttributes)) },
    group: [`AdvCampaign.${KEY}`],
    include: [
      {
        model: AdvCampaignRecord,
        as: 'records',
        attributes: [],
        required: false,
        where: dateRange,
      },
    ],
    distinct: true,
    subQuery: false,
    order: sort,
    attributes,
    limit,
    offset,
    having,
    raw,
  };

  if (query.search) {
    options.where.name = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  if (include && include.includes('budgetRecommendation')) {
    options.group.push(
      'budgetRecommendation.advCampaignBudgetRecommendationId'
    );
    options.include.push({
      model: AdvCampaignBudgetRecommendation,
      as: 'budgetRecommendation',
      required: query.scope.includes('withBudgetRecommendation'),
    });
  }

  let { rows, count } = await AdvCampaign.findAndCountAll(options);
  rows = rows.map((row) => row.toJSON());

  if (include && include.includes('previousData')) {
    const prevDateRange = generatePrevDateRange(query.dateRange);
    const prevOptions = generatePrevOptions(options, rows, prevDateRange, KEY);

    const campaigns = await AdvCampaign.findAll(prevOptions);

    rows = rows.map((row) => {
      return {
        ...row,
        previousData: campaigns.find((campaign) => campaign[KEY] === row[KEY]),
      };
    });
  }

  if (rules.length) {
    rows = rows.map((row) => {
      const rulesTriggered = rules
        .filter((rule) => {
          const { advRuleId, filters, campaigns, portfolios } = rule;
          let campaignMatch = true;
          let portfolioMatch = true;
          let productsMatch = true;

          const filtersMatch = filters.every(({ ...filter }) => {
            return assertRuleConditionMatched(filter, row[filter.attribute]);
          });

          if (campaigns.length) {
            campaignMatch = !!campaigns.find(
              ({ advCampaignId }) => advCampaignId === row.advCampaignId
            );
          }

          if (portfolios.length) {
            portfolioMatch = !!portfolios.find(
              ({ advPortfolioId }) => advPortfolioId === row.advPortfolioId
            );
          }

          if (advRuleId in ruleProductCampaigns) {
            productsMatch = ruleProductCampaigns[advRuleId].includes(
              row.advCampaignId
            );
          }

          return (
            filtersMatch && campaignMatch && portfolioMatch && productsMatch
          );
        })
        .map((rule) => rule.advOptimizationReportRuleId);

      return { ...row, reportRules: rulesTriggered };
    });
  }

  return paginate(rows, count.length, query.page, offset, limit);
};

/**
 * Get AdvCampaign by its id and profileId.
 *
 * @param {bigint} advProfileId
 * @param {bigint} advCampaignId
 * @param {boolean} allowSync
 * @returns <AdvCampaign>
 */
const getAdvCampaignById = async (
  advProfileId,
  advCampaignId,
  allowSync = false
) => {
  const advCampaign = await AdvCampaign.findOne({
    where: {
      advProfileId,
      advCampaignId,
    },
  });

  if (allowSync && advCampaign) {
    await advCampaign.sync();
  }

  return advCampaign;
};

/**
 * Get AdvCampaign by its id and profileId.
 *
 * @param bigint advProfileId
 * @param string campaignType
 * @param array advCampaignIds
 * @returns int count
 */
const coundAdvCampaignsByIds = async (
  advProfileId,
  campaignType,
  advCampaignIds
) => {
  const count = await AdvCampaign.count({
    where: {
      advProfileId,
      campaignType,
      advCampaignId: { [Op.in]: advCampaignIds },
    },
  });

  return count;
};

/**
 * Get advCampaignRecords by advProfileId.
 *
 * @param {bigint} advProfileId
 * @param {object} query
 * @returns
 */
const getAdvCampaignRecords = async (advProfileId, query) => {
  const { attributes, filter, dateRange } =
    await transformAdvertisingRecordsQuery(query);

  const data = await AdvCampaignRecord.findAll({
    attributes: ['date', ...attributes],
    where: {
      ...dateRange,
    },
    include: [
      {
        model: AdvCampaign,
        attributes: [],
        required: true,
        where: {
          advProfileId,
          ...pick(filter, keys(AdvCampaign.rawAttributes)),
        },
      },
    ],
    group: ['date'],
    order: [['date', 'ASC']],
  });

  return data;
};

const getAdvCampaignStatistics = async (advProfileId, query) => {
  const { attributes, filter, dateRange } =
    await transformAdvertisingStatisticsQuery(query);

  const groupByAttribute =
    'advCampaignId' in filter ? 'advCampaignId' : 'advProfileId';

  const defaults = {};
  attributes.forEach((attribute) => {
    defaults[attribute[1]] = 0;
  });

  const data = await AdvCampaignRecord.findOne({
    attributes,
    where: {
      ...pick(filter, keys(AdvCampaignRecord.rawAttributes)),
      ...dateRange,
    },
    include: {
      attributes: [],
      model: AdvCampaign,
      required: true,
      where: {
        advProfileId,
        ...pick(filter, keys(AdvCampaign.rawAttributes)),
      },
    },
    group: [`AdvCampaign.${groupByAttribute}`],
  });

  return data ?? defaults;
};

const bulkSyncAdvCampaigns = async (
  advProfileId,
  campaignType,
  campaigns,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!campaigns.length) return;
  let recentlyUpdatedCampaigns = [];
  let recentlyUpdatedCampaignIds = [];

  const records = campaigns.map((campaign) => {
    let obj = {
      ...campaign,
      campaignType,
      advProfileId,
      advCampaignId: campaign.campaignId,
      name: campaign.campaignName ?? campaign.name,
      budget: campaign.budget ?? campaign.dailyBudget,
      budgetType: campaign.budgetType ?? 'daily',
      syncAt: new Date(),
    };

    if ('creationDate' in campaign && 'lastUpdatedDate' in campaign) {
      obj.advPortfolioId = campaign.portfolioId || null;
      obj.createdAt = new Date(campaign.creationDate);
      obj.updatedAt = new Date(campaign.lastUpdatedDate);
    }

    return pick(obj, advCampaignAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedCampaignIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advCampaignId);

    if (recentlyUpdatedCampaignIds.length) {
      recentlyUpdatedCampaigns = await getAdvCampaignsByIds(
        recentlyUpdatedCampaignIds
      );
    }
  }

  await AdvCampaign.bulkCreate(records, {
    updateOnDuplicate: advCampaignAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedCampaignIds.length) {
    const newlyUpdatedCampaigns = await getAdvCampaignsByIds(
      recentlyUpdatedCampaignIds
    );

    for (const nuc of newlyUpdatedCampaigns) {
      const { advCampaignId, updatedAt } = nuc;

      const saved = await checkIfChangesAlreadySaved({
        advCampaignId,
        recordType: 'campaign',
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
            advCampaignId,
            recordType: 'campaign',
            activityDate: updatedAt,
            previousData: recentlyUpdatedCampaigns.find(
              (c) => c.advCampaignId === advCampaignId
            ),
            advOptimizationId: optimization
              ? optimization.advOptimizationId
              : null,
            newData: nuc,
          }
        );
      }
    }
  }
};

const getAdvCampaignsByIds = async (advCampaignids) => {
  const campaigns = await AdvCampaign.findAll({
    where: {
      advCampaignId: { [Op.in]: advCampaignids },
    },
    order: [['updatedAt', 'DESC']],
  });

  return campaigns;
};

const getAdvCampaignRecommendedBudget = async (advCampaign) => {
  const advProfile = await advCampaign.getAdvProfile();
  const apiClient = await advProfile.apiClient();

  const data = await apiClient.getCampaignRecommendations(
    advCampaign.campaignType,
    { campaignIds: [advCampaign.advCampaignId] }
  );

  return data;
};

module.exports = {
  getAdvCampaigns,
  getAdvCampaignById,
  getAdvCampaignRecords,
  coundAdvCampaignsByIds,
  getAdvCampaignStatistics,
  getAdvCampaignRecommendedBudget,
  bulkSyncAdvCampaigns,
};
