'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'employees',
        access: 'employees.groups.update',
        description: 'Manage employees groups',
      },
      {
        feature: 'employees',
        access: 'employees.groups.delete',
        description: 'Delete employees groups',
      },
    ];

    await queryInterface.bulkInsert(
      'permissions',
      permissions.map((permission) => {
        return {
          ...permission,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          {
            access: {
              [Sequelize.Op.in]: [
                'employees.groups.update',
                'employees.groups.delete',
              ],
            },
          },
          { transaction }
        ),
      ]);
    });
  },
};
