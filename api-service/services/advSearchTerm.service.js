const { Op } = require('sequelize');
const { pick, keys, uniq } = require('lodash');
const {
  AdvSearchTerm,
  AdvCampaign,
  AdvAdGroup,
  AdvKeyword,
  AdvTarget,
  AdvSearchTermRecord,
  AdvProductAd,
} = require('../models');

const KEY = 'advSearchTermId';

const {
  generatePrevOptions,
  generatePrevDateRange,
  transformAdvertisingListQuery,
} = require('./advertising.service');

const {
  getAdvRuleCondition,
  assertRuleConditionMatched,
} = require('./advRule.service');

const { paginate } = require('../services/pagination.service');

/**
 * Get list of advSearchTerms associated to advProfileId
 *
 * @param {bigint} advProfileId
 * @param {objec} query
 * @returns {object} list
 */
const getAdvSearchTerms = async (advProfileId, query, raw = false) => {
  const { pageSize: limit = null, pageOffset: offset = null, include } = query;
  let rules = [];
  let ruleAdGroups = {};

  if (query.filter.matchType) {
    query.filter.matchType = {
      [Op.in]: query.filter.matchType,
    };
  }

  // Filtering based on rules.
  if ('rules' in query.filter) {
    rules = query.filter.rules;

    query.filter.conditions = await Promise.all(
      rules.map(async (rule) => {
        let condition = await getAdvRuleCondition(rule);

        if (rule.campaigns.length) {
          condition['AdvSearchTerm.advCampaignId'] = {
            [Op.in]: rule.campaigns.map(({ advCampaignId }) => advCampaignId),
          };
        }

        if (rule.portfolios.length) {
          condition['AdvCampaign.advPortfolioId'] = {
            [Op.in]: rule.portfolios.map(
              ({ advPortfolioId }) => advPortfolioId
            ),
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

  const { attributes, filter, sort, having, dateRange } =
    await transformAdvertisingListQuery(query);

  let keywordInclude = {
    model: AdvKeyword,
    attributes: ['advKeywordId', 'bid', 'keywordText', 'matchType'],
  };

  if (query.filter.matchType) {
    keywordInclude.where = pick(filter, keys(AdvKeyword.rawAttributes));
  }

  let options = {
    distinct: true,
    subQuery: false,
    attributes,
    where: pick(filter, [...keys(AdvSearchTerm.rawAttributes), Op.and]),
    include: [
      {
        model: AdvSearchTermRecord,
        as: 'records',
        attributes: [],
        where: dateRange,
        required: false,
      },
      keywordInclude,
      {
        model: AdvTarget,
        attributes: ['advTargetId', 'bid', 'targetingText'],
      },
      {
        model: AdvAdGroup,
        attributes: ['name', 'defaultBid'],
        required: true,
      },
      {
        model: AdvCampaign,
        attributes: ['name', 'advPortfolioId'],
        required: true,
        where: {
          advProfileId,
          ...pick(filter, keys(AdvCampaign.rawAttributes)),
        },
      },
    ],
    group: [
      'AdvSearchTerm.advSearchTermId',
      'AdvTarget.advTargetId',
      'AdvKeyword.advKeywordId',
      'AdvAdGroup.advAdGroupId',
      'AdvCampaign.advCampaignId',
    ],
    having,
    order: sort,
    limit,
    offset,
    raw,
  };

  if (query.search) {
    options.where.query = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  let { rows, count } = await AdvSearchTerm.findAndCountAll(options);

  rows = rows.map((row) => row.toJSON());

  if (rows.length) {
    const advAdGroupIds = uniq(rows.map((row) => row.advAdGroupId));

    const advProductAds = await AdvProductAd.findAll({
      attributes: ['advAdGroupId', 'advProductAdId', 'asin', 'sku'],
      where: {
        state: { [Op.ne]: 'archived' },
        advAdGroupId: { [Op.in]: advAdGroupIds },
      },
    });

    rows = rows.map((row) => {
      row.AdvAdGroup.AdvProductAds = advProductAds.filter(
        (advProductAd) => advProductAd.advAdGroupId === row.advAdGroupId
      );

      return row;
    });
  }

  if (include && include.includes('previousData')) {
    const prevDateRange = generatePrevDateRange(query.dateRange);
    const prevOptions = generatePrevOptions(options, rows, prevDateRange, KEY);

    const searchTerms = await AdvSearchTerm.findAll(prevOptions);

    rows = rows.map((row) => {
      return {
        ...row,
        previousData: searchTerms.find(
          (searchTerm) => searchTerm[KEY] === row[KEY]
        ),
      };
    });
  }

  if (rules.length && rows.length) {
    rows = rows.map((row) => {
      const rulesTriggered = rules
        .filter(({ filters, campaigns, advRuleId, portfolios }) => {
          let campaignMatch = true;
          let adGroupMatch = true;
          let portfolioMatch = true;

          const filtersMatch = filters.every((filter) => {
            return assertRuleConditionMatched(filter, row[filter.attribute]);
          });

          if (campaigns.length) {
            campaignMatch = !!campaigns.find(
              ({ advCampaignId }) => advCampaignId === row.advCampaignId
            );
          }

          if (portfolios.length) {
            portfolioMatch = !!portfolios.find(
              ({ advPortfolioId }) =>
                advPortfolioId === row.AdvCampaign.advPortfolioId
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

  return paginate(rows, count.length, query.page, offset, limit);
};

module.exports = {
  getAdvSearchTerms,
};
