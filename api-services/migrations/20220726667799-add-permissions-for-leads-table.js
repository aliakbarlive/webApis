'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.profile',
        description: 'View Profile Page',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.profile.rep',
        description: 'View Representative Profile Page',
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
          { access: 'leads.profile' },
          { access: 'leads.profile.rep' },
          { transaction }
        ),
      ]);
    });
  },
};
