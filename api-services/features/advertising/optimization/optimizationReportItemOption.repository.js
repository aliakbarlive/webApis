const { Op } = require('sequelize');
const {
  AdvRuleAction,
  AdvOptimizationReport,
  AdvOptimizationReportRule,
  AdvOptimizationReportItem,
  AdvOptimizationReportItemOption,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class OptimizationReportItemOptionRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findByProfileIdReportIdItemIdAndOptionId(
    profileId,
    reportId,
    itemId,
    optionId
  ) {
    const option = await super.findOne({
      where: {
        advOptimizationReportItemOptionId: optionId,
      },
      include: [
        {
          model: AdvOptimizationReportItem,
          as: 'item',
          where: { advOptimizationReportItemId: itemId },
          required: true,
          attributes: [],
          include: {
            model: AdvOptimizationReport,
            as: 'optimizationReport',
            required: true,
            attributes: [],
            where: {
              advProfileId: profileId,
              advOptimizationReportId: reportId,
            },
          },
        },
        {
          model: AdvOptimizationReportRule,
          as: 'rule',
          attributes: [
            'advOptimizationReportRuleId',
            'advRuleActionId',
            'actionData',
          ],
          include: {
            model: AdvRuleAction,
            as: 'action',
            attributes: ['validation'],
          },
        },
      ],
    });

    return option;
  }

  async markAsUnselectedByItemIdExept(itemId, optionId) {
    await super.update(
      { selected: false },
      {
        where: {
          advOptimizationReportItemId: itemId,
          advOptimizationReportItemOptionId: {
            [Op.ne]: optionId,
          },
        },
      }
    );
  }

  async findAllSelectedByReportId(reportId) {
    const options = await super.findAll({
      where: { selected: true },
      include: [
        {
          model: AdvOptimizationReportItem,
          as: 'item',
          where: { advOptimizationReportId: reportId },
          required: true,
          attributes: [
            'values',
            'advCampaignId',
            'advAdGroupId',
            'advKeywordId',
            'advSearchTermId',
          ],
        },
        {
          model: AdvOptimizationReportRule,
          as: 'rule',
          attributes: [
            'advOptimizationReportRuleId',
            'advRuleActionId',
            'actionData',
          ],
          include: {
            model: AdvRuleAction,
            as: 'action',
            attributes: ['code', 'name'],
          },
        },
      ],
    });

    return options;
  }

  async resetByIds(reportIds) {
    await super.update(
      { selected: false, data: {} },
      {
        where: {
          advOptimizationReportItemOptionId: {
            [Op.in]: reportIds,
          },
        },
      }
    );
  }
}

module.exports = new OptimizationReportItemOptionRepository(
  AdvOptimizationReportItemOption
);
