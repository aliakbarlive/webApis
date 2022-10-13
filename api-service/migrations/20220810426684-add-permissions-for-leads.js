'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.oldLeads',
        description: 'Process Old Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.newLeads',
        description: 'Process New Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.pitcher',
        description: 'Leads pitcher',
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
          { access: 'leads.oldLeads' },
          { access: 'leads.newLeads' },
          { access: 'leads.pitcher' },
          { transaction }
        ),
      ]);
    });
  },
};
