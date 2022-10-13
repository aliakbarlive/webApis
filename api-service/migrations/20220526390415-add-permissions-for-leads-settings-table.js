'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.settings.variables.list',
        description: 'View Variables of Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.settings.variables.manage',
        description: 'Manage Variables of Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.settings.liAccount.list',
        description: 'View LinkedIn Accounts of Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.settings.liAccount.manage',
        description: 'Manage LinkedIn Accounts of Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.sales.profile.manage',
        description: 'Manage Profile Accounts of Leads',
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
          { access: 'leads.settings.variables.list' },
          { access: 'leads.settings.variables.manage' },
          { access: 'leads.settings.liAccount.list' },
          { access: 'leads.settings.liAccount.manage' },
          { access: 'leads.sales.profile.manage' },
          { transaction }
        ),
      ]);
    });
  },
};
