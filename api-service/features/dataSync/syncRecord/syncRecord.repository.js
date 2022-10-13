const { pick } = require('lodash');
const { Op } = require('sequelize');
const { SyncRecord, Account, AgencyClient } = require('@models');

const BaseRepository = require('../../base/base.repository');

class SyncRecordRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  /**
   * Find Sync record by id.
   *
   * @param {bigint} syncRecordId
   * @param {object} options
   * @returns {SyncRecord} syncRecord
   */
  async findById(syncRecordId, options) {
    let queryOptions = {};

    if (options.include.includes('account')) {
      queryOptions.include = {
        model: Account,
        as: 'account',
        attributes: ['accountId', 'name'],
        required: true,
        include: {
          model: AgencyClient,
          attributes: ['agencyClientId', 'client'],
          required: true,
        },
      };
    }

    const syncRecord = await super.findById(syncRecordId, queryOptions);

    return syncRecord;
  }

  async findAndCountAll(options) {
    const { page, sort, search, include, pageSize, pageOffset, ...filter } =
      options;

    let queryOptions = {
      where: pick(filter, this.getAttributes()),
      include: {
        model: Account,
        as: 'account',
        attributes: [],
        required: true,
        include: {
          model: AgencyClient,
          attributes: [],
          required: true,
        },
      },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    };

    if (include.includes('account')) {
      queryOptions.include.attributes = ['accountId', 'name'];
      queryOptions.include.include.attributes = ['agencyClientId', 'client'];
    }

    if (search) {
      queryOptions.include.include.where = {
        client: {
          [Op.iLike]: `%${search}%`,
        },
      };
    }

    const { rows, count } = await super.findAndCountAll(queryOptions);

    return { rows, count };
  }
}

module.exports = new SyncRecordRepository(SyncRecord);
