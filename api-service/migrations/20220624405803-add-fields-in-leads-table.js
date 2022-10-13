'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'competitorAsinRevenueScreenshot',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'asinRevenueScreenshotDateStamp',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'competitorAsinRevenueScreenshotDateStamp',
          {
            type: Sequelize.DATE,
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
          'leads',
          'competitorAsinRevenueScreenshot',
          {
            transaction,
          }
        ),
        queryInterface.removeColumn('leads', 'asinRevenueScreenshotDateStamp', {
          transaction,
        }),
        queryInterface.removeColumn(
          'leads',
          'competitorAsinRevenueScreenshotDateStamp',
          {
            transaction,
          }
        ),
      ]);
    });
  },
};
