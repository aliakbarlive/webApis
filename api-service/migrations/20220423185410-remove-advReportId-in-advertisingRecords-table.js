'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(
          'advCampaignRecords',
          'advReportId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: { tableName: 'advReports', schema: 'public' },
              key: 'advReportId',
            },
          },
          {
            transaction,
          }
        ),

        queryInterface.removeColumn(
          'advAdGroupRecords',
          'advReportId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: { tableName: 'advReports', schema: 'public' },
              key: 'advReportId',
            },
          },
          {
            transaction,
          }
        ),

        queryInterface.removeColumn(
          'advKeywordRecords',
          'advReportId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: { tableName: 'advReports', schema: 'public' },
              key: 'advReportId',
            },
          },
          {
            transaction,
          }
        ),

        queryInterface.removeColumn(
          'advTargetRecords',
          'advReportId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: { tableName: 'advReports', schema: 'public' },
              key: 'advReportId',
            },
          },
          {
            transaction,
          }
        ),

        queryInterface.removeColumn(
          'advProductAdRecords',
          'advReportId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: { tableName: 'advReports', schema: 'public' },
              key: 'advReportId',
            },
          },
          {
            transaction,
          }
        ),

        queryInterface.removeColumn(
          'advSearchTermRecords',
          'advReportId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: { tableName: 'advReports', schema: 'public' },
              key: 'advReportId',
            },
          },
          {
            transaction,
          }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('advCampaignRecords', 'advReportId', {
          transaction,
        }),

        queryInterface.addColumn('advAdGroupRecords', 'advReportId', {
          transaction,
        }),

        queryInterface.addColumn('advKeywordRecords', 'advReportId', {
          transaction,
        }),

        queryInterface.addColumn('advTargetRecords', 'advReportId', {
          transaction,
        }),

        queryInterface.addColumn('advProductAdRecords', 'advReportId', {
          transaction,
        }),

        queryInterface.addColumn('advSearchTermRecords', 'advReportId', {
          transaction,
        }),
      ]);
    });
  },
};
