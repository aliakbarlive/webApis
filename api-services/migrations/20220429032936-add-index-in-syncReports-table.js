'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('syncReports', {
      fields: ['syncRecordId', 'status'],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('syncReports', ['syncRecordId', 'status']);
  },
};
