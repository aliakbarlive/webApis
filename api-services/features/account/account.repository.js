const { Op } = require('sequelize');
const { Account, Credential } = require('@models');

const BaseRepository = require('../base/base.repository');

class AccountRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findByIdWithAdvCredentials(accountId) {
    return await super.findById(accountId, {
      include: {
        model: Credential,
        as: 'credentials',
        required: true,
        where: {
          service: 'advApi',
        },
      },
    });
  }

  async findAllByAccountIds(accountIds, options = {}) {
    const { include = [] } = options;

    let queryOptions = {
      where: {
        accountId: {
          [Op.in]: accountIds,
        },
      },
    };

    if (include.includes('credential')) {
      queryOptions.include = {
        model: Credential,
        as: 'credentials',
        required: true,
      };
    }

    return await super.findAll(queryOptions);
  }
}

module.exports = new AccountRepository(Account);
