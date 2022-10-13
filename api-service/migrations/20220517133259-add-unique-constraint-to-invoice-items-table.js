'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('invoiceItems', {
      fields: ['invoiceItemId'],
      type: 'unique',
      name: 'invoiceItems_invoiceItemId_unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'invoiceItems',
      'invoiceItems_invoiceItemId_unique'
    );
  },
};
