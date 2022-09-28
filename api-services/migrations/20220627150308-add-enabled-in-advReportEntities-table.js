'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('advReportEntities', 'enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.bulkUpdate(
      'advReportEntities',
      { enabled: false },
      { tactic: 'remarketing' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('advReportEntities', 'enabled', {
      transaction,
    });
  },
};
