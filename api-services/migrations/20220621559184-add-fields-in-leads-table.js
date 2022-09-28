'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'linkedinContact',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'decisionMakersEmail',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'instagram',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'facebook',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'subCategory1',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'subCategory2',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'channelPartnerType',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'asinMajorKeyword',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'asinFullTitle',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'asinRevenueScreenshot',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'linkedinContact', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'decisionMakersEmail', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'instagram', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'facebook', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'subCategory1', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'subCategory2', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'channelPartnerType', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'asinMajorKeyword', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'asinFullTitle', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'asinRevenueScreenshot', {
          transaction,
        }),
      ]);
    });
  },
};
