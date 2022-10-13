'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'invoices',
        access: 'invoices.void',
        description: 'Void Invoice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'invoices',
        access: 'invoices.writeoff',
        description: 'Write Off Invoice',
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
