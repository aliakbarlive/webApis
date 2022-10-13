const { Op, col } = require('sequelize');
const {
  AccountEmployee,
  Account,
  AgencyClient,
  Cell,
  Pod,
  Squad,
  User,
  Role,
} = require('../models');

// Static Roles
const squadRoles = ['operations manager', 'project manager'];
const podRoles = ['senior account manager', 'senior project coordinator'];
const cellRoles = [
  'account manager',
  'account coordinator',
  'project coordinator',
];
const squadPPCRoles = [''];
const podPPCRoles = ['ppc team lead'];
const cellPPCRoles = ['ppc specialist', 'junior ppc specialist'];
const operationRoles = [
  'operations manager',
  'project manager',
  'senior account manager',
  'senior project coordinator',
  'account manager',
  'account coordinator',
  'project coordinator',
];
const ppcRoles = [
  'ppc team lead',
  'ppc specialist',
  'junior ppc specialist',
  'head of ppc',
];
const writingRoles = [
  'head of writing',
  'writing team lead',
  'senior editor',
  'editor',
  'copywriter',
  'keyword researcher',
];
const designRoles = [
  'head of design',
  'design team lead',
  'senior graphic designer',
  'graphic designer',
];

const salesRoles = ['sales manager', 'sales team lead', 'sales representative'];
const salesLeadRoles = [
  'lead generation manager',
  'lead generation team lead',
  'lead generation captain',
  'lead generation representative',
];

/**
 * Get all Clients assigned to an Employee
 *
 * @param {uuid} userId
 * @returns {object} list
 */
const getClients = async (userId, search) => {
  const options = {
    include: [
      {
        model: AccountEmployee,
        as: 'employees',
        attributes: [],
        where: {
          userId: userId,
        },
      },
      {
        attributes: ['zohoId'],
        model: AgencyClient,
      },
    ],
    limit: 10,
    where: {},
  };

  options.where.name = {
    [Op.iLike]: `%${search ? search : ''}%`,
  };
  const clients = await Account.findAll(options);

  return clients;
};

const getEmployeesClients = async (userId, query) => {
  const { search, page, pageSize, sortField, sortOrder } = query;
  const options = {
    include: [
      {
        model: AccountEmployee,
        as: 'employees',
        attributes: [],
        where: {
          userId: userId,
        },
      },
    ],
    limit: 10,
    where: {},
  };

  options.where.name = {
    [Op.iLike]: `%${search ? search : ''}%`,
  };
  const { count, rows } = await Account.findAndCountAll(options);

  return { count, rows, page, pageSize, sortField, sortOrder };
};

/**
 * Include users in group query (cells, pods, squads)
 *
 * @param {array} groupRoles
 * @returns {object} query row with users
 */
const queryIncludeUsers = (groupRoles) => {
  return {
    model: User,
    as: 'users',
    attributes: ['userId', 'firstName', 'lastName', 'email'],
    through: { attributes: [] },
    include: {
      model: Role,
      as: 'role',
      attributes: ['name', 'level'],
      where: { name: { [Op.in]: groupRoles } },
    },
  };
};

/**
 * Get all employees assigned to cell
 *
 * @param {int} cellId
 * @returns {object} cell row with users
 */
const getCellEmployees = async (cellId) => {
  return await Cell.findByPk(cellId, {
    attributes: ['name', 'cellId'],
    include: queryIncludeUsers(cellRoles),
  });
};

/**
 * Get all employees assigned to a pod
 *
 * @param {int} podId
 * @returns {object} pod row with users
 */
const getPodEmployees = async (podId) => {
  return await Pod.findByPk(podId, {
    attributes: ['name', 'podId'],
    include: queryIncludeUsers(podRoles),
  });
};

/**
 * Get all employees assigned to a squad
 *
 * @param {int} squadId
 * @returns {object} squad row with users
 */
const getSquadEmployees = async (squadId) => {
  return await Squad.findByPk(squadId, {
    attributes: ['name', 'squadId'],
    include: queryIncludeUsers(squadRoles),
  });
};

/**
 * Get all employees by group Type
 *
 * @param {string} type - operations, ppc, writing, design
 * @returns {object} filtered list of users
 */
const getEmployeesByType = async (type) => {
  let typeRoles = [];

  switch (type) {
    case 'operations':
      typeRoles = operationRoles;
      break;
    case 'ppc':
      typeRoles = ppcRoles;
      break;
    case 'writing':
      typeRoles = writingRoles;
      break;
    case 'design':
      typeRoles = designRoles;
      break;
    case 'sales':
      typeRoles = salesRoles;
      break;
    case 'sales lead':
      typeRoles = salesLeadRoles;
      break;
    default:
      typeRoles = operationRoles;
      break;
  }

  return await User.findAll({
    attributes: ['userId', 'firstName', 'lastName', 'email'],
    include: {
      model: Role,
      as: 'role',
      attributes: ['name'],
      where: { name: { [Op.in]: typeRoles } },
    },
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC'],
    ],
  });
};

/**
 * Get all operations employees from cell to squad
 *
 * @param {string} type - operations | ppc
 * @param {int} cellId
 * @returns {object} filtered list of users
 */
const getEmployeesFromCellToSquad = async (type, cellId) => {
  const data = await Cell.findByPk(cellId, {
    attributes: ['name', 'cellId'],
    include: [
      queryIncludeUsers(type === 'ppc' ? cellPPCRoles : cellRoles),
      {
        model: Pod,
        as: 'pod',
        attributes: ['podId', 'name'],
        include: [
          queryIncludeUsers(type === 'ppc' ? podPPCRoles : podRoles),
          {
            model: Squad,
            as: 'squad',
            attributes: ['squadId', 'name'],
            include: queryIncludeUsers(
              type === 'ppc' ? squadPPCRoles : squadRoles
            ),
          },
        ],
      },
    ],
  });

  const {
    users,
    pod: {
      users: podUsers,
      squad: { users: squadUsers },
    },
  } = data;

  return [...users, ...podUsers, ...squadUsers];
};

module.exports = {
  getClients,
  getEmployeesClients,
  squadRoles,
  podRoles,
  cellRoles,
  squadPPCRoles,
  podPPCRoles,
  cellPPCRoles,
  writingRoles,
  designRoles,
  getCellEmployees,
  getPodEmployees,
  getSquadEmployees,
  queryIncludeUsers,
  getEmployeesByType,
  getEmployeesFromCellToSquad,
};
