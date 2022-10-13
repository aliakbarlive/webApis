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
            roleId: 33,
            name: 'sales lead',
            level: 'agency',
            groupLevel: 'squad',
            allowPerGroup: 1,
            department: 'sales',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 34,
            name: 'sales manager',
            level: 'agency',
            groupLevel: 'pod',
            allowPerGroup: 1,
            department: 'sales',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: 35,
            name: 'sales representative',
            level: 'agency',
            groupLevel: 'cell',
            allowPerGroup: 1,
            department: 'sales',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t }
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
    await queryInterface.bulkDelete(
      'roles',
      { roleId: { [Sequelize.Op.in]: [33, 34, 35] } },
      {}
    );
  },
};
