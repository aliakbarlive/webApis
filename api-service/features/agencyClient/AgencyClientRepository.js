const { AgencyClient, Account, Subscription, User } = require('@models');
const { Op, literal } = require('sequelize');

const BaseRepository = require('../base/base.repository');

class AgencyClientRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findByAccountId(accountId, options = {}) {
    const agencyClient = await super.findOne({
      where: { accountId },
      ...options,
    });

    return agencyClient;
  }

  async findUnassignedClients(options = {}) {
    let { sort, pageSize, pageOffset, search } = options;
    let where = {};
    if (search) {
      where = {
        client: {
          [Op.startsWith]: search,
        },
      };
    }

    console.log(where);
    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
      attributes: ['agencyClientId', 'client', 'status', 'createdAt'],
      where: {
        ...where,
        [Op.all]: literal(
          '(SELECT COUNT(*) FROM "cellClient" WHERE "agencyClientId" = "AgencyClient"."agencyClientId") < 2'
        ),
        status: 'subscribed',
      },
      include: [
        {
          attributes: ['accountId', 'isOnboarding', 'planId'],
          model: Account,
          as: 'account',
          include: {
            attributes: ['status'],
            model: Subscription,
            as: 'subscription',
          },
        },
        {
          attributes: ['userId', 'firstName', 'lastName', 'email'],
          model: User,
          as: 'defaultContact',
        },
      ],
    });
    return { rows, count };
  }
}

module.exports = new AgencyClientRepository(AgencyClient);
