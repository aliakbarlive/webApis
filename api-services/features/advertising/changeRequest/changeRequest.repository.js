const { literal, cast } = require('sequelize');
const { pick, keys } = require('lodash');

const {
  Cell,
  User,
  Account,
  UserGroup,
  AdvProfile,
  Marketplace,
  AdvCampaign,
  AgencyClient,
  AdvRuleAction,
  AdvOptimization,
  AdvChangeRequest,
  AdvOptimizationBatch,
  AdvChangeRequestItem,
  AdvOptimizationReportItem,
  AdvOptimizationReportRule,
} = require('@models');

const BaseRepository = require('../../base/base.repository');

class ChangeRequestRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async createWithItems(data) {
    const changeRequest = await super.create(data, {
      include: {
        model: AdvChangeRequestItem,
        as: 'items',
      },
    });

    return changeRequest;
  }

  /**
   * Find and count count all.
   *
   * @param {object} query
   * @returns {Promise<object>}
   */
  async findAndCountAll(query) {
    const { pageOffset, pageSize, filter, sort } = query;

    const { rows, count } = await super.findAndCountAll({
      attributes: {
        include: [
          [
            cast(
              literal(
                `(
                SELECT COUNT(*) FROM "advChangeRequestItems"
                  where "advChangeRequestItems"."advChangeRequestId" = "AdvChangeRequest"."advChangeRequestId"
              )`
              ),
              'int'
            ),
            'totalCount',
          ],
          ...['pending', 'approved', 'rejected'].map((status) => {
            return [
              cast(
                literal(
                  `(
                  SELECT COUNT(*) FROM "advChangeRequestItems"
                    where "advChangeRequestItems"."advChangeRequestId" = "AdvChangeRequest"."advChangeRequestId" AND "status" = '${status}'
                )`
                ),
                'int'
              ),
              `${status}Count`,
            ];
          }),
        ],
      },
      include: [
        {
          model: AdvChangeRequestItem,
          as: 'items',
          attributes: [],
          where: pick(filter, keys(AdvChangeRequestItem.rawAttributes)),
        },
        {
          model: User,
          as: 'requestor',
          attributes: ['firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['firstName', 'lastName', 'email'],
        },
        {
          model: AdvProfile,
          as: 'advProfile',
          attributes: ['advProfileId'],
          required: true,
          include: {
            model: Account,
            as: 'account',
            required: true,
            attributes: ['accountId', 'name'],
          },
        },
        {
          model: AgencyClient,
          attributes: ['client', 'agencyClientId'],
          as: 'client',
          required: true,
          include: {
            model: Cell,
            attributes: [],
            through: { attributes: [] },
            required: true,
            as: 'cells',
            include: {
              model: UserGroup,
              attributes: [],
              where: pick(filter, keys(UserGroup.rawAttributes)),
              required: true,
            },
          },
        },
      ],
      distinct: true,
      offset: pageOffset,
      limit: pageSize,
      order: sort,
    });

    return { rows, count };
  }

  /**
   * Find change request by id.
   *
   * @param {uuid} changeRequestId
   * @param {object} options
   * @returns {Promise<AdvChangeRequest>} changeRequest
   */
  async findById(changeRequestId, query = {}) {
    let options = { include: [] };

    if (query.include && query.include.includes('items')) {
      options.include.push({
        model: AdvChangeRequestItem,
        as: 'items',
        where: query.status ? { status: query.status } : {},
        required: false,
        include: [
          {
            model: AdvCampaign,
            as: 'campaign',
            attributes: ['name', 'dailyBudget'],
          },
          {
            model: User,
            as: 'evaluator',
            attributes: ['firstName', 'lastName', 'email'],
          },
          {
            model: AdvOptimization,
            as: 'optimization',
            include: [
              {
                model: AdvOptimizationReportRule,
                as: 'rule',
                attributes: ['name', 'actionData'],
                include: {
                  model: AdvRuleAction,
                  as: 'action',
                  attributes: ['name', 'code'],
                },
              },
              {
                model: AdvOptimizationReportItem,
                as: 'reportItem',
                attributes: [
                  'values',
                  'advCampaignId',
                  'advAdGroupId',
                  'advKeywordId',
                  'advSearchTermId',
                ],
              },
            ],
          },
        ],
      });
    }

    if (query.include && query.include.includes('advProfile')) {
      options.include.push({
        model: AdvProfile,
        as: 'advProfile',
        include: {
          model: Marketplace,
          as: 'marketplace',
        },
      });
    }

    if (query.include && query.include.includes('optimizationBatch')) {
      options.include.push({
        model: AdvOptimizationBatch,
        as: 'optimizationBatch',
      });
    }

    if (query.include && query.include.includes('requestor')) {
      options.include.push({
        model: User,
        as: 'requestor',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      });
    }

    const changeRequest = super.findById(changeRequestId, options);

    return changeRequest;
  }
}

module.exports = new ChangeRequestRepository(AdvChangeRequest);
