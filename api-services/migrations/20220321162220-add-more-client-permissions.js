'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'termination',
        access: 'termination.approve',
        description: 'Approve Termination Request',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('permissions', permissions, { transaction }),

        queryInterface.bulkUpdate(
          'permissions',
          {
            description: 'Create Termination Request',
            feature: 'termination',
            access: 'termination.create',
          },
          { access: 'clients.termination.create' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          {
            description: 'View Termination Request',
            feature: 'termination',
            access: 'termination.view',
          },
          { access: 'clients.termination.view' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          {
            description: 'Update Termination Request',
            feature: 'termination',
            access: 'termination.update',
          },
          { access: 'clients.termination.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          {
            description: 'Delete Termination Request',
            feature: 'termination',
            access: 'termination.delete',
          },
          { access: 'clients.termination.delete' },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          {
            access: 'termination.approve',
          },
          { transaction }
        ),
      ]);
    });
  },
};
