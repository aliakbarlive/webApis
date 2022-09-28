const {
  User,
  AdvProfile,
  AdvRuleAction,
  AdvOptimization,
  AdvOptimizationBatch,
  AdvOptimizationReportItem,
  AdvOptimizationReportRule,
} = require('@models');
const { pick, keys } = require('lodash');

const BaseRepository = require('../../base/base.repository');

class OptimizationRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findById(id, options = {}) {
    let query = {
      include: [],
    };

    if (options.include && options.include.includes('batch')) {
      query.include.push({
        as: 'batch',
        model: AdvOptimizationBatch,
        include: { model: AdvProfile, as: 'advProfile' },
      });
    }

    if (options.include && options.include.includes('reportItem')) {
      query.include.push({
        model: AdvOptimizationReportItem,
        as: 'reportItem',
        attributes: [
          'values',
          'advCampaignId',
          'advAdGroupId',
          'advKeywordId',
          'advSearchTermId',
        ],
      });
    }

    const optimization = await super.findById(id, query);

    return optimization;
  }

  async findAndCountAllByProfileId(profileId, options = {}) {
    const { pageSize, pageOffset, sort, filter } = options;

    const { rows, count } = await super.findAndCountAll({
      attributes: { exclude: ['logs'] },
      where: pick(filter, this.getAttributes()),
      include: [
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
        {
          as: 'batch',
          model: AdvOptimizationBatch,
          attributes: ['processedAt', 'startDate', 'endDate', 'userId'],
          where: {
            advProfileId: profileId,
            ...pick(filter, keys(AdvOptimizationBatch.rawAttributes)),
          },
          include: {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName'],
          },
        },
      ],
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new OptimizationRepository(AdvOptimization);
