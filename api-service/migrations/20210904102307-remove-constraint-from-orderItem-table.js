'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'orderItems',
      'orderItems_amazonOrderId_fkey'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('orderItems', {
      fields: ['amazonOrderId'],
      type: 'foreign key',
      name: 'orderItems_amazonOrderId_fkey',
      references: {
        table: 'orders',
        field: 'amazonOrderId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
};
