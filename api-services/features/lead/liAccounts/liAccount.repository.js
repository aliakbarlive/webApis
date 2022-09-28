const { LinkedInAccount } = require('@models');

const BaseRepository = require('../../base/base.repository');

class LinkedInAccountsRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountLinkedInAccounts(options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new LinkedInAccountsRepository(LinkedInAccount);
