'use strict';
const tableName = 'roles';
const sequenceColumn = 'roleId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert(
        'roles',
        [
          {
            roleId: 10,
            name: 'operations manager',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 11,
            name: 'project manager',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 12,
            name: 'senior account manager',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 13,
            name: 'senior project coordinator',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 14,
            name: 'account manager',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 15,
            name: 'project coordinator',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 16,
            name: 'account coordinator',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 17,
            name: 'ppc team lead',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 18,
            name: 'ppc specialist',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 19,
            name: 'junior ppc specialist',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t, ignoreDuplicates: true }
      );

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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
