'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'reports',
        access: 'reports.view',
        description: 'View Reports',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'reports',
        access: 'reports.revenue.view',
        description: 'Access Revenue Reports',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('permissions', permissions, { transaction }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          { access: 'reports.view' },
          { access: 'reports.revenue.view' },
          { transaction }
        ),
      ]);
    });
  },
};
