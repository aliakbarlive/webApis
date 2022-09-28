const { AdvProfile } = require('@models');

const BaseRepository = require('../../base/base.repository');

class ProfileRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountAllByAccountId(accountId, options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      where: { accountId },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new ProfileRepository(AdvProfile);
