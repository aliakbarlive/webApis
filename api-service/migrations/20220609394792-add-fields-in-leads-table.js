'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'companyAverageMonthlyRevenue',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'callRecording2',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'companyAverageMonthlyRevenue', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'callRecording2', {
          transaction,
        }),
      ]);
    });
  },
};
