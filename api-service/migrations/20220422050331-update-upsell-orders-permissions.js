'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'clients',
        access: 'clients.upsells.list',
        description: 'View Upsells',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'clients',
        access: 'clients.upsells.orders.list',
        description: 'View Upsell Orders',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('permissions', permissions, { transaction }),
        queryInterface.bulkDelete(
          'permissions',
          { access: 'upsells.orders.create' },
          { access: 'upsells.order.delete' },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'upsells',
        access: 'upsells.orders.create',
        description: 'Add Upsell Order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.order.delete',
        description: 'Delete Upsell Order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          { access: 'client.upsells.list' },
          { access: 'client.upsells.orders.list' },
          { transaction }
        ),
        queryInterface.bulkInsert('permissions', permissions, { transaction }),
      ]);
    });
  },
};
