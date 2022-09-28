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
            roleId: 1,
            name: 'user',
            level: 'application',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 2,
            name: 'administrator',
            level: 'system',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 3,
            name: 'super user',
            level: 'system',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 4,
            name: 'super user',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 5,
            name: 'sales administrator',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 6,
            name: 'administrator',
            level: 'agency',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 7,
            name: 'administrator',
            level: 'account',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 8,
            name: 'owner',
            level: 'account',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 9,
            name: 'user',
            level: 'account',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {
          transaction: t,
          ignoreDuplicates: true,
        }
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
