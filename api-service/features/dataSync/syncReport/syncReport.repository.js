const { pick } = require('lodash');
const { Op } = require('sequelize');
const { SyncReport, SyncRecord } = require('@models');

const BaseRepository = require('../../base/base.repository');

class SyncReportRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findById(syncReportId, options = {}) {
    const { include = [] } = options;

    let queryOptions = {};

    if (include.includes('syncRecord')) {
      queryOptions.include = {
        model: SyncRecord,
        as: 'syncRecord',
      };
    }

    const syncReport = await super.findById(syncReportId, queryOptions);
    return syncReport;
  }

  async updateBySyncReportId(syncReportId, data) {
    await super.update(data, { where: { syncReportId } });
  }

  async countBySyncRecordId(syncRecordId, options) {
    let queryOptions = { where: { syncRecordId, ...options } };

    if (queryOptions.where.status === 'NOT-STARTED') {
      queryOptions.where.status = { [Op.not]: 'STARTED' };
    }

    const count = await super.count(queryOptions);

    return count;
  }

  async findAndCountAll(options) {
    const { page, sort, pageSize, pageOffset, ...filter } = options;

    const { rows, count } = await super.findAndCountAll({
      where: pick(filter, this.getAttributes()),
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new SyncReportRepository(SyncReport);
