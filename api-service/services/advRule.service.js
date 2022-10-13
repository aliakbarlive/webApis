const { Op } = require('sequelize');
const { pick, isNull } = require('lodash');
const {
  AdvRuleAction,
  AdvCampaign,
  AdvRuleProduct,
  AdvRuleCampaign,
  AdvPortfolio,
  AdvRulePortfolio,
} = require('../models');

const {
  updateAdvRule,
  createAdvRule,
  findAllAdvRule,
  findOneAdvRule,
  advRuleAttributes,
  findAndCountAllAdvRule,
} = require('../repositories/advRule.repository');

const {
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  NOT_EQUAL_TO,
  EQUAL_TO,
  BETWEEN,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
} = require('../utils/constants');

/**
 * List advRules by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
exports.listAdvRulesByAccountId = async (accountId, query) => {
  const { filter, page, pageSize, pageOffset, sort } = query;

  filter.accountId = {
    [Op.or]: {
      [Op.eq]: accountId,
      [Op.is]: null,
    },
  };

  filter.marketplaceId = {
    [Op.or]: { [Op.eq]: filter.marketplaceId, [Op.is]: null },
  };

  const options = {
    where: pick(filter, advRuleAttributes),
    include: {
      model: AdvRuleAction,
      as: 'action',
      attributes: ['name', 'code'],
    },
    offset: pageOffset,
    limit: pageSize,
    order: sort,
  };

  const { rows, count } = await findAndCountAllAdvRule(options);

  return { page, pageSize, count, rows };
};

const transformFilterValue = (comparison, value) => {
  switch (comparison) {
    case LESS_THAN:
      return { [Op.lt]: value };
    case LESS_THAN_OR_EQUAL_TO:
      return { [Op.lte]: value };
    case NOT_EQUAL_TO:
      return { [Op.ne]: value };
    case EQUAL_TO:
      return value;
    case BETWEEN:
      return { [Op.between]: value };
    case GREATER_THAN:
      return { [Op.gt]: value };
    case GREATER_THAN_OR_EQUAL_TO:
      return { [Op.gte]: value };
  }
};

exports.getAdvRulesByIds = async (advRuleIds) => {
  const rules = await findAllAdvRule({
    attributes: ['advRuleId', 'name', 'actionData', 'filters'],
    where: {
      advRuleId: {
        [Op.in]: advRuleIds,
      },
    },
    include: [
      {
        model: AdvRuleAction,
        as: 'action',
        attributes: ['name', 'code'],
      },
      {
        model: AdvCampaign,
        as: 'campaigns',
        attributes: ['advCampaignId'],
        through: { attributes: [] },
      },
      {
        model: AdvPortfolio,
        as: 'portfolios',
        attributes: ['advPortfolioId'],
        through: { attributes: [] },
      },
      {
        model: AdvRuleProduct,
        as: 'products',
        attributes: ['asin', 'sku'],
      },
    ],
  });

  return rules;
};

exports.getAdvRulesConditions = async (rules) => {
  const conditions = rules.map(({ filters }) => {
    return this.getAdvRuleCondition({ filters });
  });

  return conditions;
};

exports.getAdvRuleCondition = async ({ filters }) => {
  let condition = {};
  filters.forEach(({ attribute, comparison, value }) => {
    condition[attribute] =
      attribute in condition
        ? {
            [Op.and]: [
              condition[attribute],
              transformFilterValue(comparison, value),
            ],
          }
        : transformFilterValue(comparison, value);
  });

  return condition;
};

exports.assertRuleConditionMatched = (filter, value, acceptsNull = false) => {
  if (acceptsNull && isNull(value)) return true;

  switch (filter.comparison) {
    case LESS_THAN:
      return value < filter.value;
    case LESS_THAN_OR_EQUAL_TO:
      return value <= filter.value;
    case EQUAL_TO:
      return value === filter.value;
    case NOT_EQUAL_TO:
      return value !== filter.value;
    case GREATER_THAN:
      return value > filter.value;
    case GREATER_THAN_OR_EQUAL_TO:
      return value >= filter.value;
    case BETWEEN:
      const [min, max] = filter.value;
      return min <= value && value <= max;
    default:
      return false;
  }
};

exports.createAdvRuleByAccountId = async (accountId, data) => {
  const advRuleAction = await AdvRuleAction.findOne({
    where: { code: data.actionCode },
  });

  const advRule = await createAdvRule(
    pick(
      {
        ...data,
        accountId,
        advRuleActionId: advRuleAction.advRuleActionId,
      },
      advRuleAttributes
    )
  );

  if (data.advCampaignIds.length) {
    await advRule.addCampaigns(data.advCampaignIds);
  }

  if (data.advPortfolioIds.length) {
    await advRule.addPortfolios(data.advPortfolioIds);
  }

  if (data.products.length) {
    await AdvRuleProduct.bulkCreate(
      data.products.map((product) => {
        return {
          ...product,
          advRuleId: advRule.advRuleId,
        };
      })
    );
  }

  if (
    !data.advCampaignIds.length &&
    !data.advPortfolioIds.length &&
    !data.products.length
  ) {
    await updateAdvRule(advRule, { marketplaceId: null });
  }

  return advRule;
};

exports.updateAdvRuleByAccountIdAndId = async (accountId, advRuleId, data) => {
  const advRule = await findOneAdvRule({ where: { accountId, advRuleId } });

  if (advRule) {
    const advRuleAction = await AdvRuleAction.findOne({
      where: { code: data.actionCode },
    });

    const newData = pick(
      { ...data, advRuleActionId: advRuleAction.advRuleActionId },
      advRuleAttributes
    );

    await updateAdvRule(advRule, newData);

    await AdvRuleCampaign.destroy({ where: { advRuleId } });
    await AdvRuleProduct.destroy({ where: { advRuleId } });
    await AdvRulePortfolio.destroy({ where: { advRuleId } });

    if (data.advPortfolioIds.length) {
      await advRule.addPortfolios(data.advPortfolioIds);
    }

    if (data.advCampaignIds.length) {
      await advRule.addCampaigns(data.advCampaignIds);
    }

    if (data.products.length) {
      await AdvRuleProduct.bulkCreate(
        data.products.map((product) => {
          return { ...product, advRuleId };
        })
      );
    }

    if (!data.advCampaignIds.length && !data.products.length) {
      await updateAdvRule(advRule, { marketplaceId: null });
    }
  }

  return advRule;
};

exports.getAdvRuleByAccountIdAndId = async (accountId, advRuleId) => {
  const advRule = await findOneAdvRule({
    where: { accountId, advRuleId },
    include: [
      {
        model: AdvRuleAction,
        as: 'action',
        attributes: ['name', 'code'],
      },
      {
        model: AdvCampaign,
        as: 'campaigns',
        attributes: ['advCampaignId'],
        through: { attributes: [] },
      },
      {
        model: AdvPortfolio,
        as: 'portfolios',
        attributes: ['advPortfolioId'],
        through: { attributes: [] },
      },
      {
        model: AdvRuleProduct,
        as: 'products',
        attributes: ['asin', 'sku'],
      },
    ],
  });

  return advRule;
};
