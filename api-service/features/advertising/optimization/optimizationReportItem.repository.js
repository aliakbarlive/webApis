const { Op } = require('sequelize');

const {
  AdvRuleAction,
  AdvOptimizationReport,
  AdvOptimizationReportRule,
  AdvOptimizationReportItem,
  AdvOptimizationReportItemOption,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class OptimizationReportItemRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  /**
   * Find all items by ids.
   *
   * @param {array} ids
   * @param {object} query
   * @returns {Promise<array>} items
   */
  async findAllByIds(ids, query) {
    let options = {
      include: [],
      where: {
        advOptimizationReportItemId: { [Op.in]: ids },
      },
    };

    if (query.include && query.include.includes('options')) {
      options.include.push({
        model: AdvOptimizationReportItemOption,
        as: 'options',
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
      });
    }

    const items = await super.findAll(options);

    return items;
  }

  async findAllSelectedByReportId(advOptimizationReportId) {
    const items = await super.findAll({
      where: { advOptimizationReportId },
      include: {
        model: AdvOptimizationReportItemOption,
        as: 'options',
        where: { selected: true },
        required: true,
      },
    });

    return items;
  }

  /**
   * Check if item exists.
   *
   * @param {bigint} profileId
   * @param {bigint} reportId
   * @param {string} id
   * @returns {Promise<AdvOptimizationReportItem>}
   */
  async checkIfExistByProfileIdReportIdAndId(profileId, reportId, id) {
    const item = await super.exists({
      where: { advOptimizationReportItemId: id },
      include: {
        model: AdvOptimizationReport,
        as: 'optimizationReport',
        required: true,
        where: {
          advProfileId: profileId,
          advOptimizationReportId: reportId,
        },
      },
    });

    return item;
  }

  /**
   * Bulk Create items with options
   *
   * @param {array} records
   * @returns {Array<AdvOptimizationReportItem>} items
   */
  async bulkCreateWithOptions(records) {
    const items = super.bulkCreate(records, {
      updateOnDuplicate: super.getAttributes(),
      include: {
        model: AdvOptimizationReportItemOption,
        as: 'options',
        updateOnDuplicate: [
          'advOptimizationReportRuleId',
          'advOptimizationReportItemId',
        ],
      },
    });

    return items;
  }
}

module.exports = new OptimizationReportItemRepository(
  AdvOptimizationReportItem
);
