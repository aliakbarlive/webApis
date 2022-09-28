'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('credentials', {
      fields: ['accountId', 'service'],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('credentials', ['accountId', 'service']);
  },
};
