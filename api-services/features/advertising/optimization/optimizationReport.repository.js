const {
  AdvRuleAction,
  AdvOptimizationReport,
  AdvOptimizationReportItem,
  AdvOptimizationReportItemOption,
  AdvOptimizationReportRule,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class OptimizationReportRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findByProfileIdAndId(profileId, id, options = {}) {
    let query = {
      include: [],
      where: {
        advProfileId: profileId,
        advOptimizationReportId: id,
      },
    };

    if (options.include && options.include.includes('rules')) {
      query.include.push({
        model: AdvOptimizationReportRule,
        as: 'rules',
      });
    }

    if (options.include && options.include.includes('selectedItems')) {
      query.include.push({
        model: AdvOptimizationReportItem,
        as: 'items',
        attributes: [
          'values',
          'advCampaignId',
          'advAdGroupId',
          'advKeywordId',
          'advSearchTermId',
        ],
        include: {
          model: AdvOptimizationReportItemOption,
          as: 'options',
          where: {
            selected: true,
          },
          include: {
            model: AdvOptimizationReportRule,
            as: 'rule',
            attributes: ['name', 'actionData'],
            include: {
              model: AdvRuleAction,
              as: 'action',
              attributes: ['name', 'code'],
            },
          },
        },
      });
    }

    const optimizationReport = super.findOne(query);

    return optimizationReport;
  }

  async createWithRule(data) {
    const optimizationReport = super.create(data, {
      include: { model: AdvOptimizationReportRule, as: 'rules' },
    });

    return optimizationReport;
  }
}

module.exports = new OptimizationReportRepository(AdvOptimizationReport);
