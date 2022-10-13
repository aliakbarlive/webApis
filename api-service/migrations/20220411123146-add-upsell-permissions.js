'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'upsells',
        access: 'upsells.list',
        description: 'View List of Upsells',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.view',
        description: 'View Upsell',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.create',
        description: 'Add Upsell',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.update',
        description: 'Update Upsell',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.delete',
        description: 'Delete Upsell',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.approve',
        description: 'Approve Upsell',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.invoice.view',
        description: 'View Upsell Invoice ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.invoice.operation',
        description: 'Charge Client/Generate Invoice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.orders.list',
        description: 'View List of Upsell Orders',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.orders.view',
        description: 'View Upsell Order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.orders.create',
        description: 'Add Upsell Order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.orders.update',
        description: 'Update Upsell Order',
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
      {
        feature: 'upsells',
        access: 'upsells.order.comments.view',
        description: 'View Upsell Order Comments',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.order.comments.create',
        description: 'Add Upsell Order Comment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.order.comments.delete',
        description: 'Delete Upsell Order Comment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.items.list',
        description: 'View List of Upsell Items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.items.view',
        description: 'View Upsell Item',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.items.create',
        description: 'Add Upsell Item',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.items.update',
        description: 'Update Upsell Item',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'upsells',
        access: 'upsells.items.delete',
        description: 'Delete Upsell Item',
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
          { access: 'upsells.list' },
          { access: 'upsells.view' },
          { access: 'upsells.create' },
          { access: 'upsells.update' },
          { access: 'upsells.delete' },
          { access: 'upsells.approve' },
          { access: 'upsells.invoice.view' },
          { access: 'upsells.invoice.operation' },
          { access: 'upsells.orders.list' },
          { access: 'upsells.orders.view' },
          { access: 'upsells.orders.create' },
          { access: 'upsells.orders.update' },
          { access: 'upsells.order.delete' },
          { access: 'upsells.orders.comments.view' },
          { access: 'upsells.orders.comments.create' },
          { access: 'upsells.orders.comments.delete' },
          { access: 'upsells.items.list' },
          { access: 'upsells.items.view' },
          { access: 'upsells.items.create' },
          { access: 'upsells.items.update' },
          { access: 'upsells.items.delete' },
          { transaction }
        ),
      ]);
    });
  },
};
