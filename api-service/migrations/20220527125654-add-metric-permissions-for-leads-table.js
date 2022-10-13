'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.metrics',
        description: 'View Metrics Page',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.metrics.overall.metrics',
        description: 'View Overall Metrics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.metrics.graph.metrics',
        description: 'View Graph Metrics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.metrics.group.metrics',
        description: 'View Group Metrics',
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
          { access: 'leads.metrics' },
          { access: 'leads.metrics.overall.metrics' },
          { access: 'leads.metrics.graph.metrics' },
          { access: 'leads.metrics.group.metrics' },
          { transaction }
        ),
      ]);
    });
  },
};
