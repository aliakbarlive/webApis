const { pick, trimEnd } = require('lodash');
const { Op, literal } = require('sequelize');
const {
  InitialSyncStatus,
  Account,
  AgencyClient,
  Credential,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class InitialSyncStatusRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountAll(options) {
    const {
      page,
      sort,
      search,
      scope,
      include,
      pageSize,
      pageOffset,
      ...filter
    } = options;

    let queryOptions = {
      distinct: true,
      subQuery: false,
      where: pick(filter, this.getAttributes()),
      include: {
        model: Account,
        as: 'account',
        attributes: [],
        required: true,
        include: [
          {
            model: AgencyClient,
            attributes: [],
            required: true,
          },
        ],
      },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    };

    if (include.includes('account')) {
      queryOptions.include.include[0].attributes = ['agencyClientId', 'client'];
      queryOptions.include.attributes = {
        exclude: ['isOnboarding', 'planId', 'createdAt', 'updatedAt'],
        include: [
          'accountId',
          'name',
          [
            literal(
              `(SELECT EXISTS
            (
              SELECT * FROM credentials
                where "credentials"."accountId" = "account"."accountId"
                and service = 'spApi'
            )
          )`
            ),
            'spApiAuthorized',
          ],
          [
            literal(
              `(SELECT EXISTS
            (
              SELECT * FROM credentials
                where "credentials"."accountId" = "account"."accountId"
                and service = 'advApi'
            )
          )`
            ),
            'advApiAuthorized',
          ],
        ],
      };
    }

    if (
      scope.includes('spApiAuthorized') ||
      scope.includes('advApiAuthorized')
    ) {
      queryOptions.include.include.push({
        model: Credential,
        as: 'credentials',
        attributes: [],
        where: {},
        required: true,
      });

      if (scope.includes('spApiAuthorized')) {
        queryOptions.include.include[1].where.service = 'spApi';
      }

      if (scope.includes('advApiAuthorized')) {
        queryOptions.include.include[1].where.service = 'advApi';
      }
    }

    if (search) {
      queryOptions.include.include[0].where = {
        client: {
          [Op.iLike]: `%${search}%`,
        },
      };
    }

    const { rows, count } = await super.findAndCountAll(queryOptions);

    return { rows, count };
  }

  async findAll(options) {
    const { sort, search, scope, include, ...filter } = options;

    let queryOptions = {
      distinct: true,
      subQuery: false,
      where: pick(filter, this.getAttributes()),
      include: {
        model: Account,
        as: 'account',
        attributes: [],
        required: true,
        include: [
          {
            model: AgencyClient,
            attributes: [],
            required: true,
          },
        ],
      },
      order: sort,
    };

    if (include.includes('account')) {
      queryOptions.include.include[0].attributes = ['agencyClientId', 'client'];
      queryOptions.include.attributes = {
        exclude: ['isOnboarding', 'planId', 'createdAt', 'updatedAt'],
        include: [
          'accountId',
          'name',
          [
            literal(
              `(SELECT EXISTS
            (
              SELECT * FROM credentials
                where "credentials"."accountId" = "account"."accountId"
                and service = 'spApi'
            )
          )`
            ),
            'spApiAuthorized',
          ],
          [
            literal(
              `(SELECT EXISTS
            (
              SELECT * FROM credentials
                where "credentials"."accountId" = "account"."accountId"
                and service = 'advApi'
            )
          )`
            ),
            'advApiAuthorized',
          ],
        ],
      };
    }

    if (
      scope.includes('spApiAuthorized') ||
      scope.includes('advApiAuthorized')
    ) {
      queryOptions.include.include.push({
        model: Credential,
        as: 'credentials',
        attributes: [],
        where: {},
        required: true,
      });

      if (scope.includes('spApiAuthorized')) {
        queryOptions.include.include[1].where.service = 'spApi';
      }

      if (scope.includes('advApiAuthorized')) {
        queryOptions.include.include[1].where.service = 'advApi';
      }
    }

    if (search) {
      queryOptions.include.include[0].where = {
        client: {
          [Op.iLike]: `%${search}%`,
        },
      };
    }

    const initialSyncStatus = await super.findAll(queryOptions);

    return initialSyncStatus;
  }
}

module.exports = new InitialSyncStatusRepository(InitialSyncStatus);
