const { pick } = require('lodash');
const { Op } = require('sequelize');
const { AdvChangeRequestItem } = require('../../../models');

const BaseRepository = require('../../base/base.repository');

class ChangeRequestItemRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAllPendingByChangeRequestIdAndIds(advChangeRequestId, ids) {
    return await super.findAll({
      where: {
        advChangeRequestId,
        status: 'pending',
        advChangeRequestItemId: { [Op.in]: ids },
      },
    });
  }

  async countPendingByChangeRequestIdAndIds(
    advChangeRequestId,
    ids,
    options = {}
  ) {
    const { ...filter } = options;

    return await super.count({
      where: {
        advChangeRequestId,
        advChangeRequestItemId: { [Op.in]: ids },
        ...pick(filter, super.getAttributes()),
      },
    });
  }

  async updateByIds(ids, data) {
    return await super.update(data, {
      where: {
        advChangeRequestItemId: {
          [Op.in]: ids,
        },
      },
    });
  }
}

module.exports = new ChangeRequestItemRepository(AdvChangeRequestItem);
