const zohoSubscription = require('../utils/zohoSubscription');
const {
  AgencyClient,
  AgencyClientLog,
  Subscription,
  User,
  Account,
  Commission,
  Invite,
  ClientMigration,
  Checklist,
  ClientChecklist,
  Credential,
  Termination,
  Cell,
  Role,
  Pod,
  Squad,
  SubscriptionCycleDate,
  UserGroup,
  AccountMarketplace,
  Marketplace,
  sequelize,
} = require('../models');
const { literal, Op, where, col } = require('sequelize');
const {
  cellRoles,
  podRoles,
  squadRoles,
  queryIncludeUsers,
} = require('./agencyEmployee.service');

const getClients = async (
  user,
  { sort, pageSize, pageOffset, search, status, migrateOnly }
) => {
  let order = sort;

  if (sort[0].includes('subscription') || sort[0].includes('activated_at')) {
    let subscription_sort = '';
    if (sort[0].includes('subscription')) {
      subscription_sort = 'status';
    } else if (sort[0].includes('activated_at')) {
      subscription_sort = 'activatedAt';
    }

    order = [
      [
        { model: Account, as: 'account' },
        { model: Subscription, as: 'subscription' },
        subscription_sort,
        sort[0][1],
      ],
    ];
  }

  let options = {
    attributes: [
      'agencyClientId',
      'client',
      'siEmail',
      'phone',
      'status',
      'zohoId',
      'createdAt',
      'categoryList',
      'contractSigned',
      'contactName',
      'contactName2',
      'primaryEmail',
      'secondaryEmail',
      'thirdEmail',
      'service',
      'accountStatus',
      [
        literal(`(
                  SELECT 
                    CAST(count("clientChecklists".status) AS INTEGER) as count 
                  FROM "clientChecklists" 
                  WHERE "clientChecklists".status = 'incomplete' and 
                  "clientChecklists"."agencyClientId" = "AgencyClient"."agencyClientId"
                )`),
        'inComplete',
      ],
      [
        literal(`(
                  SELECT 
                    CAST(count("clientChecklists".status) AS INTEGER) as count 
                  FROM "clientChecklists" 
                  WHERE "clientChecklists".status = 'in-progress' and 
                  "clientChecklists"."agencyClientId" = "AgencyClient"."agencyClientId"
                )`),
        'inProgress',
      ],
      [
        literal(`(
                  SELECT 
                    CAST(count("clientChecklists".status) AS INTEGER) as count 
                  FROM "clientChecklists" 
                  WHERE "clientChecklists".status = 'complete' and 
                  "clientChecklists"."agencyClientId" = "AgencyClient"."agencyClientId"
                )`),
        'Complete',
      ],
    ],
    include: [
      {
        model: User,
        as: 'defaultContact',
        attributes: ['firstName', 'lastName', 'email'],
      },
      {
        model: Account,
        as: 'account',
        attributes: ['planId'],
        include: [
          {
            model: Subscription,
            as: 'subscription',
            attributes: [
              'subscriptionId',
              'status',
              'isOffline',
              'activatedAt',
            ],
            ...(status === 'offline' && {
              where: { isOffline: { [Op.eq]: true } },
            }),
            ...((status === 'non_renewing' ||
              status === 'paused' ||
              status === 'unpaid' ||
              status === 'expired' ||
              status === 'dunning' ||
              status === 'cancelled') && {
              where: { status: { [Op.eq]: status } },
            }),
          },
          {
            model: Credential,
            as: 'credentials',
            attributes: ['service'],
          },
        ],
      },
      {
        model: Termination,
        as: 'termination',
        attributes: ['status'],
      },
      {
        model: ClientMigration,
        attributes: ['id'],
        ...(migrateOnly == true && {
          where: { id: { [Op.not]: null } },
        }),
      },
    ],
    where: {},
    order,
    distinct: true,
    limit: pageSize,
    offset: pageOffset,
  };

  if (search) {
    options.where.client = {
      [Op.iLike]: `%${search}%`,
    };
  }

  if (status) {
    switch (status) {
      case '':
        break;
      case 'offline':
      case 'non_renewing':
      case 'paused':
      case 'expired':
      case 'unpaid':
      case 'dunning':
      case 'cancelled':
        options.where.$and = where(
          col(`account->subscription.subscriptionId`),
          Op.not,
          null
        );
        break;
      default:
        options.where.status = {
          [Op.eq]: status,
        };
        break;
    }
  }

  let cellIncludeOption = {
    attributes: ['cellId', 'name', 'isPpc', 'type'],
    model: Cell,
    as: 'cells',
    through: { attributes: [] },
    include: [
      {
        attributes: ['podId', 'name', 'isPpc'],
        model: Pod,
        as: 'pod',
        include: [
          {
            attributes: ['squadId', 'name', 'isPpc'],
            model: Squad,
            as: 'squad',
            include: {
              attributes: ['firstName', 'lastName', 'email'],
              model: User,
              as: 'users',
              through: { attributes: [] },
              include: {
                model: Role,
                as: 'role',
                required: true,
                where: { groupLevel: 'squad' },
              },
            },
          },
          {
            attributes: ['firstName', 'lastName', 'email'],
            model: User,
            as: 'users',
            through: { attributes: [] },
            include: {
              model: Role,
              as: 'role',
              required: true,
              where: { groupLevel: 'pod' },
            },
          },
        ],
      },
      {
        attributes: ['firstName', 'lastName', 'email'],
        model: User,
        as: 'users',
        through: { attributes: [] },
        include: { model: Role, as: 'role', required: true },
      },
    ],
  };

  const { level, groupLevel, hasAccessToAllClients } = user.role;

  if (!hasAccessToAllClients && level === Role.AGENCY_LEVEL && groupLevel) {
    cellIncludeOption.required = true;
    let useGroupCondition = { userId: user.userId };

    if (user.memberId !== null) {
      const { squadId, podId, cellId } = user.memberId;

      if (groupLevel === 'squad') useGroupCondition = { squadId };
      if (groupLevel === 'pod') useGroupCondition = { podId };
      if (groupLevel === 'cell') useGroupCondition = { cellId };
    }

    cellIncludeOption.include.push({
      model: UserGroup,
      where: useGroupCondition,
      required: true,
    });
  }

  options.include.push(cellIncludeOption);

  return await AgencyClient.findAndCountAll(options);
};

/**
 * Get agencyClient details (including defaultContact, Account [Subscription, Commission, Invites])
 *
 * @param {uuid} agencyClientId
 * @returns {object} agencyClient details
 */
const getClient = async (agencyClientId) => {
  const client = await AgencyClient.findByPk(agencyClientId, {
    include: [
      {
        model: User,
        as: 'defaultContact',
        attributes: ['firstName', 'lastName', 'email'],
      },
      {
        model: Account,
        as: 'account',
        attributes: ['accountId', 'planId', 'isOnboarding', 'name'],
        include: [
          {
            model: Subscription,
            as: 'subscription',
            attributes: ['subscriptionId', 'status', 'activatedAt'],
          },
          {
            model: Commission,
            as: 'commissions',
          },
          {
            model: Credential,
            as: 'credentials',
            attributes: ['service'],
          },
          {
            model: AccountMarketplace,
            as: 'marketplaces',
            attributes: ['marketplaceId', 'isDefault'],
            include: {
              model: Marketplace,
              attributes: ['countryCode'],
              as: 'details',
            },
          },
        ],
      },
      {
        model: Account,
        attributes: ['accountId'],
        as: 'account',
        include: {
          model: Invite,
          as: 'invites',
          attributes: ['inviteId'],
        },
      },
      {
        model: ClientMigration,
      },
      {
        model: ClientChecklist,
      },
      {
        model: Termination,
        as: 'termination',
        include: [
          {
            model: User,
            as: 'accountManager',
            attributes: ['userId', 'firstName', 'lastName', 'email'],
          },
          {
            model: User,
            as: 'seniorAccountManager',
            attributes: ['userId', 'firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: Cell,
        as: 'cells',
        attributes: ['cellId', 'isPpc', 'name', 'type'],
        through: { attributes: [] },
        include: [
          queryIncludeUsers(cellRoles),
          {
            model: Pod,
            as: 'pod',
            attributes: ['podId', 'name'],
            include: [
              queryIncludeUsers(podRoles),
              {
                model: Squad,
                as: 'squad',
                attributes: ['squadId', 'name'],
                include: queryIncludeUsers(squadRoles),
              },
            ],
          },
        ],
      },
      {
        model: SubscriptionCycleDate,
        attributes: [
          ['subscriptionStartDate', 'start'],
          ['subscriptionValidUntilDate', 'validUntil'],
        ],
      },
    ],
  });

  return client;
};

/**
 * * Get Agency Client by accountId
 * @param {string} accountId
 * @returns {object} agency client
 */
const getClientByAccountId = async (accountId) => {
  return await AgencyClient.findOne({ where: { accountId } });
};

/**
 * Add user to account
 * @param {uuid} userId
 * @param {uuid} agencyClientId
 * @param {string} roleId
 * @returns {Promise} Member
 */
const addUserAsDefaultContact = async (userId, agencyClientId) => {
  const agencyClient = await AgencyClient.findByPk(agencyClientId);
  await agencyClient.update({ defaultContactId: userId });
};

/**
 * Add user to account
 * @param {uuid} agencyClientId
 * @param {payload} data
 * @returns {Promise} updated AgencyClient
 */
const updateAgencyClient = async (agencyClientId, data) => {
  return await AgencyClient.update(data, { where: { agencyClientId } });
};

/*
 * Get Checklist by Client Id
 * @param {string} agencyClientId
 * @param {int} checklistId - Optional for getting single checklist
 * @returns {Array} Checklists
 */
const getChecklistByClientId = async (agencyClientId, checklistId = null) => {
  let where = null;
  if (checklistId !== null) {
    where = { checklistId };
  }

  return await Checklist.findAll({
    attributes: [
      'checklistId',
      'name',
      'defaultToggle',
      'checklistType',
      'defaultValue',
    ],
    where,
    include: {
      attributes: [
        'checklistId',
        'clientChecklistId',
        'status',
        'toggle',
        'value',
        [
          literal(`(
                    SELECT 
                      CAST(count("logId") AS INTEGER) as count 
                    FROM logs 
                    WHERE "referenceId" = "clientChecklistId"
                    AND "logType"='clientChecklist'
                  )`),
          'logs',
        ],
        'createdAt',
        'updatedAt',
      ],
      model: ClientChecklist,
      as: 'clientChecklist',
      required: false,
      include: {
        attributes: [],
        model: AgencyClient,
        as: 'agencyClient',
        where: { agencyClientId },
      },
    },
    order: [['checklistId', 'ASC']],
  });
};

/**
 * Get Checklist By Id
 * @param {Integer} id Checklist By Id
 * @returns {Object}
 */
const getChecklistById = async (id) => {
  return await Checklist.findByPk(id);
};

/**
 * Get Checklist By Id
 * @param {Integer} id Checklist By Id
 * @returns {Object}
 */
const updateChecklistById = async ({ checklistId, payload }) => {
  const checklist = await Checklist.findByPk(checklistId);
  return await checklist.update({ ...payload });
};

/**
 * Get Single Client Checklist Id
 * @param {Integer} id ClientChecklist Id
 * @returns {Object}
 */
const getClientChecklistById = async (id) => {
  return await ClientChecklist.findByPk(id);
};

/*
 * Update Client Checklist
 * @param {string} agencyClientId
 * @param {string} checklistId
 * @param {object} payload
 * @returns {Promise} ClientChecklist
 */
const updateChecklistByClientId = async (
  agencyClientId,
  checklistId,
  payload
) => {
  const [clientChecklist, created] = await ClientChecklist.findOrCreate({
    where: {
      agencyClientId,
      checklistId,
    },
    defaults: payload,
  });

  let data = clientChecklist;

  if (!created) {
    data = await clientChecklist.update(payload);
  }

  return data;
};

/*
 * Update Client Checklist
 * @param {string} agencyClientId
 * @param {string} checklistId
 * @param {object} payload
 * @returns {Promise} ClientChecklist
 */
const updateChecklistService = async (checklistId, defaultValue) => {
  const data = await Checklist.update(
    { defaultValue },
    {
      where: {
        checklistId,
      },
    }
  );
  return data;
};

/**
 * Add user to account
 * @param {string} zohoId
 * @param {uuid} agencyClientId
 */
const addZohoId = async (zohoId, agencyClientId) => {
  const agencyClient = await AgencyClient.findByPk(agencyClientId);
  await agencyClient.update({ zohoId });
};

/**
 * Get Invoice Emails by ZohoId
 * @param {string} ZohoID
 * @param {array} invoiceEmails
 */
const getInvoiceEmailsByZohoId = async (zohoId) => {
  return await AgencyClient.findOne({
    attributes: ['invoiceEmails'],
    where: {
      zohoId,
    },
  });
};

/**
 * Get Client by SI Email
 * @param {string} siEmail
 * @param {object} AgencyClient
 */
const getClientBySiEmail = async (siEmail) => {
  return await AgencyClient.findOne({
    where: {
      siEmail: siEmail.split(','),
    },
    include: {
      model: Cell,
      as: 'cells',
      attributes: ['cellId', 'name', 'type'],
      through: { attributes: [] },
    },
  });
};

const getClientByName = async (client) => {
  const escapedClient = sequelize.escape(`${client}`);
  return await AgencyClient.findOne({
    where: literal(`similarity(client,${escapedClient}) > 0.6`),
    include: {
      model: Cell,
      as: 'cells',
      attributes: ['cellId', 'name', 'type'],
      through: { attributes: [] },
    },
  });
};

// https://www.zoho.com/subscriptions/api/v1/#Customers_Update_a_customer
const updateZohoEmail = async (customerId, body) => {
  const output = await zohoSubscription.callAPI({
    method: 'PUT',
    operation: `customers/${customerId}`,
    body,
  });
  return output;
};

/**
 * List Client Logs
 * @param {uuid} agencyClientId
 */
const listAgencyClientLogs = async (
  agencyClientId,
  { pageOffset, pageSize }
) => {
  return await AgencyClientLog.findAndCountAll({
    where: { agencyClientId },
    limit: pageSize,
    offset: pageOffset,
  });
};

/**
 * Add Client Log
 * @param {object} data
 */
const addAgencyClientLog = async (data) => {
  return await AgencyClientLog.create(data);
};

/**
 * Add Client Log
 * @param {uuid} accountId
 * @param {object} data
 */
const addAgencyClientLogWithAccountId = async (accountId, data) => {
  const client = await AgencyClient.findOne({ where: { accountId } });
  const details = { ...data, agencyClientId: client.agencyClientId };
  return await AgencyClientLog.create(details);
};

const updateNoCommission = async (
  agencyClientId,
  noCommission,
  noCommissionReason
) => {
  const data = await AgencyClient.update(
    { noCommission, noCommissionReason },
    {
      where: {
        agencyClientId,
      },
    }
  );
  return data;
};

module.exports = {
  getClients,
  getClient,
  getClientByAccountId,
  updateAgencyClient,
  addUserAsDefaultContact,
  getChecklistByClientId,
  getChecklistById,
  updateChecklistById,
  updateChecklistByClientId,
  updateChecklistService,
  addZohoId,
  getInvoiceEmailsByZohoId,
  getClientChecklistById,
  getClientBySiEmail,
  getClientByName,
  updateZohoEmail,
  listAgencyClientLogs,
  addAgencyClientLog,
  addAgencyClientLogWithAccountId,
  updateNoCommission,
};
