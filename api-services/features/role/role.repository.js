const { Role } = require('@models');
const { Op } = require('sequelize');

const BaseRepository = require('../base/base.repository');

class RoleRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountRoles(options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new RoleRepository(Role);
