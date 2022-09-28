const {
  AdvRuleAction,
  AdvOptimization,
  AdvChangeRequest,
  AdvOptimizationBatch,
  AdvOptimizationReportItem,
  AdvOptimizationReportRule,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class OptimizationBatchRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findById(id, options = {}) {
    let query = {};

    if (options.include && options.include.includes('optimizations')) {
      query.include = [
        {
          model: AdvOptimization,
          as: 'optimizations',
          include: [
            {
              model: AdvOptimizationReportItem,
              as: 'reportItem',
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
              attributes: ['name', 'actionData'],
              include: {
                model: AdvRuleAction,
                as: 'action',
                attributes: ['name', 'code'],
              },
            },
          ],
        },
      ];
    }
    const batch = await super.findById(id, query);

    return batch;
  }

  async createWithOptimizations(data) {
    let options = {
      include: [{ model: AdvOptimization, as: 'optimizations' }],
    };

    if (data.changeRequest) {
      options.include.push({ model: AdvChangeRequest, as: 'changeRequest' });
    }

    const batch = await super.create(data, options);

    return batch;
  }
}

module.exports = new OptimizationBatchRepository(AdvOptimizationBatch);
