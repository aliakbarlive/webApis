'use strict';

const { Role } = require('../models');

const {
  APPLICATION_USER,
  SYSTEM_ADMINISTRATOR,
  SYSTEM_SUPER_USER,
  AGENCY_SUPER_USER,
  AGENCY_SALES_ADMINISTRATOR,
  AGENCY_ADMINISTRATOR,
  ACCOUNT_OWNER,
  ACCOUNT_ADMINISTRATOR,
  ACCOUNT_USER,
  AGENCY_OPERATIONS_MANAGER,
  AGENCY_PROJECT_MANAGER,
  AGENCY_SENIOR_ACCOUNT_MANAGER,
  AGENCY_SENIOR_PROJECT_COORDINATOR,
  AGENCY_ACCOUNT_MANAGER,
  AGENCY_PROJECT_COORDINATOR,
  AGENCY_ACCOUNT_COORDINATOR,
  AGENCY_PPC_TEAM_LEAD,
  AGENCY_PPC_SPECIALIST,
  AGENCY_JR_PPC_SPECIALIST,
  AGENCY_HEAD_OF_WRITING,
  AGENCY_WRITING_TEAM_LEAD,
  AGENCY_SENIOR_EDITOR,
  AGENCY_EDITOR,
  AGENCY_COPYWRITER,
  AGENCY_KEYWORD_RESEARCHER,
  AGENCY_HEAD_OF_DESIGN,
  AGENCY_DESIGN_TEAM_LEAD,
  AGENCY_SENIOR_GRAPHIC_DESIGNER,
  AGENCY_GRAPHIC_DESIGNER,
  AGENCY_HEAD_OF_PPC,
  AGENCY_OPERATIONS_GENERAL_MANAGER,
  AGENCY_DIRECTOR_OF_OPERATIONS,
} = require('../utils/constants');

const tableName = 'roles';
const sequenceColumn = 'roleId';

const roles = [
  {
    roleId: 1,
    name: APPLICATION_USER,
    level: 'application',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 2,
    name: SYSTEM_ADMINISTRATOR,
    level: 'system',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 3,
    name: SYSTEM_SUPER_USER,
    level: 'system',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 4,
    name: AGENCY_SUPER_USER,
    level: 'agency',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: true,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 5,
    name: AGENCY_SALES_ADMINISTRATOR,
    level: 'agency',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: true,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 6,
    name: AGENCY_ADMINISTRATOR,
    level: 'agency',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: true,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 7,
    name: ACCOUNT_ADMINISTRATOR,
    level: 'account',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 8,
    name: ACCOUNT_OWNER,
    level: 'account',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 9,
    name: ACCOUNT_USER,
    level: 'account',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 10,
    name: AGENCY_OPERATIONS_MANAGER,
    level: 'agency',
    groupLevel: 'squad',
    hasAccessToAllClients: false,
    department: 'operations',
    allowPerGroup: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 11,
    name: AGENCY_PROJECT_MANAGER,
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 12,
    name: AGENCY_SENIOR_ACCOUNT_MANAGER,
    level: 'agency',
    groupLevel: 'pod',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 13,
    name: AGENCY_SENIOR_PROJECT_COORDINATOR,
    level: 'agency',
    groupLevel: 'pod',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 14,
    name: AGENCY_ACCOUNT_MANAGER,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 2,
    hasAccessToAllClients: false,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 15,
    name: AGENCY_PROJECT_COORDINATOR,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 16,
    name: AGENCY_ACCOUNT_COORDINATOR,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 17,
    name: AGENCY_PPC_TEAM_LEAD,
    level: 'agency',
    groupLevel: 'pod',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'ppc',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 18,
    name: AGENCY_PPC_SPECIALIST,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'ppc',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 19,
    name: AGENCY_JR_PPC_SPECIALIST,
    level: 'agency',
    createdAt: new Date(),
    updatedAt: new Date(),
    hasAccessToAllClients: false,
    department: 'ppc',
    groupLevel: 'cell',
    allowPerGroup: 2,
  },
  {
    roleId: 20,
    name: AGENCY_HEAD_OF_WRITING,
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    hasAccessToAllClients: true,
    department: 'writing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 21,
    name: AGENCY_WRITING_TEAM_LEAD,
    level: 'agency',
    groupLevel: 'pod',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'writing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 22,
    name: AGENCY_SENIOR_EDITOR,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 8,
    hasAccessToAllClients: false,
    department: 'writing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 23,
    name: AGENCY_EDITOR,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 8,
    hasAccessToAllClients: false,
    department: 'writing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 24,
    name: AGENCY_COPYWRITER,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 8,
    hasAccessToAllClients: false,
    department: 'writing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 25,
    name: AGENCY_KEYWORD_RESEARCHER,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 8,
    hasAccessToAllClients: false,
    department: 'writing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 26,
    name: AGENCY_HEAD_OF_DESIGN,
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    hasAccessToAllClients: true,
    department: 'design',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 27,
    name: AGENCY_DESIGN_TEAM_LEAD,
    level: 'agency',
    groupLevel: 'pod',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: 'design',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 28,
    name: AGENCY_SENIOR_GRAPHIC_DESIGNER,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 8,
    hasAccessToAllClients: false,
    department: 'design',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 29,
    name: AGENCY_GRAPHIC_DESIGNER,
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 8,
    hasAccessToAllClients: false,
    department: 'design',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 30,
    name: AGENCY_HEAD_OF_PPC,
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    hasAccessToAllClients: true,
    department: 'ppc',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 31,
    name: AGENCY_OPERATIONS_GENERAL_MANAGER,
    level: 'agency',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: true,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 32,
    name: AGENCY_DIRECTOR_OF_OPERATIONS,
    level: 'agency',
    groupLevel: null,
    allowPerGroup: null,
    hasAccessToAllClients: true,
    department: 'operations',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert('roles', roles, {
        ignoreDuplicates: true,
      });

      const [[{ max }]] = await queryInterface.sequelize.query(
        `SELECT MAX("${sequenceColumn}") AS max FROM public."${tableName}";`,
        { transaction: t }
      );

      await queryInterface.sequelize.query(
        `ALTER SEQUENCE public."${tableName}_${sequenceColumn}_seq" RESTART WITH ${
          max + 1
        };`,
        { transaction: t }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
