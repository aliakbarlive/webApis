'use strict';
const tableName = 'roles';
const sequenceColumn = 'roleId';

const newRoles = [
  {
    roleId: 36,
    name: 'lead generation manager',
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    department: 'sales lead',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 37,
    name: 'lead generation team lead',
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    department: 'sales lead',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 38,
    name: 'lead generation captain',
    level: 'agency',
    groupLevel: 'pod',
    allowPerGroup: 1,
    department: 'sales lead',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roleId: 39,
    name: 'lead generation representative',
    level: 'agency',
    groupLevel: 'cell',
    allowPerGroup: 20,
    department: 'sales lead',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkUpdate(
        'roles',
        {
          name: 'sales manager',
        },
        { roleId: 33 },
        { transaction: t }
      ),
        await queryInterface.bulkUpdate(
          'roles',
          {
            name: 'sales team lead',
          },
          { roleId: 34 },
          { transaction: t }
        ),
        await queryInterface.bulkUpdate(
          'roles',
          {
            name: 'sales representative',
            allowPerGroup: 20,
          },
          { roleId: 35 },
          { transaction: t }
        ),
        await queryInterface.bulkInsert('roles', newRoles, { transaction: t });

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
      { name: { [Sequelize.Op.in]: newRoles.map((el) => el.name) } },
      {}
    );
  },
};
