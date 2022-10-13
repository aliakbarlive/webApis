const { pick } = require('lodash');

const {
  User,
  Account,
  AdvReport,
  AdvProfile,
  AgencyClient,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class ReportRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findById(reportId, options = {}) {
    const { include = [] } = options;

    options.include = include.map((relation) => {
      if (relation === 'advProfile.account') {
        return {
          model: AdvProfile,
          as: 'advProfile',
          include: {
            model: Account,
            as: 'account',
          },
        };
      }

      if (relation === 'client') {
        return {
          model: AgencyClient,
          as: 'client',
          attributes: ['client'],
        };
      }

      if (relation === 'generatedBy') {
        return {
          model: User,
          as: 'generatedBy',
          attributes: ['firstName', 'lastName'],
        };
      }
    });

    const report = await super.findById(reportId, options);

    return report;
  }

  /**
   * Find and count all by profileId.
   *
   * @param {bigint} profileId
   * @param {object} options
   * @returns {object}
   */
  async findAndCountAll(options) {
    let {
      pageSize,
      pageOffset,
      sort,
      search,
      include = [],
      ...filter
    } = options;

    include = include.map((relation) => {
      if (relation === 'generatedBy') {
        return {
          model: User,
          as: 'generatedBy',
          attributes: ['firstName', 'lastName'],
        };
      }
    });

    const { rows, count } = await super.findAndCountAll({
      attributes: { exclude: ['data', 'options'] },
      where: pick(filter, this.getAttributes()),
      include,
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new ReportRepository(AdvReport);
