'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advOptimizationReportRules',
          'portfolios',
          {
            type: Sequelize.JSONB,
            defaultValue: [],
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(
          'advOptimizationReportRules',
          'portfolios',
          {
            transaction,
          }
        ),
      ]);
    });
  },
};
