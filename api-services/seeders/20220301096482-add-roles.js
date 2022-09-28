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
            roleId: 20,
            name: 'head of writing',
            level: 'agency',
            groupLevel: 'squad',
            allowPerGroup: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 21,
            name: 'writing team lead',
            level: 'agency',
            groupLevel: 'pod',
            allowPerGroup: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 22,
            name: 'senior editor',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 23,
            name: 'editor',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 24,
            name: 'copywriter',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 25,
            name: 'keyword researcher',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 26,
            name: 'head of design',
            level: 'agency',
            groupLevel: 'squad',
            allowPerGroup: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 27,
            name: 'design team lead',
            level: 'agency',
            groupLevel: 'pod',
            allowPerGroup: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 28,
            name: 'senior graphic designer',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 29,
            name: 'graphic designer',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 8,
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
