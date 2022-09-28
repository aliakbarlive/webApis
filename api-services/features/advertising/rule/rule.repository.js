const { Op } = require('sequelize');
const {
  AdvRule,
  AdvCampaign,
  AdvRuleProduct,
  AdvRuleAction,
  AdvPortfolio,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class RuleRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async getByAccountIdCampaignTypeRecordTypeAndIds(
    accountId,
    campaignType,
    recordType,
    ids
  ) {
    const rules = await super.findAll({
      include: [
        { model: AdvRuleAction, as: 'action', attributes: ['name', 'code'] },
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
      where: {
        recordType,
        campaignType,
        advRuleId: { [Op.in]: ids },
        accountId: {
          [Op.or]: { [Op.eq]: accountId, [Op.is]: null },
        },
      },
    });

    return rules;
  }
}

module.exports = new RuleRepository(AdvRule);
