'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'source',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'amazonProduct',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'majorKeywordSearchPage',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'competitorsProduct',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'competitorsWebsite',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'spokeTo',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'personsResponsible',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'mainObjectivePainPoints',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'otherSalesChannels',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'ppcSpend',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'avgACOS',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'quote',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'firstCallSummary',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'serviceConditionsForOP',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'email',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'otherEmails',
          {
            type: Sequelize.JSONB,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'mockListing',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'ownersFullName',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'phoneNumber',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'aboutUs',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'qualifiedFromLIAccount',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'qualifiedBy',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'totalOfASINSAndVariations',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'callRecording',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'productCategory',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'paymentStatus',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'paymentType',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'plan',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'stage',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'averageMonthlyAmazonSales',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'averageMonthlyOutsideAmazonSales',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'mainIssueWithAmazon',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'podId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'pods',
                schema: 'public',
              },
              key: 'podId',
            },
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'source', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'amazonProduct', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'majorKeywordSearchPage', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'competitorsProduct', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'competitorsWebsite', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'spokeTo', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'personsResponsible', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'mainObjectivePainPoints', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'otherSalesChannels', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'ppcSpend', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'avgACOS', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'quote', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'firstCallSummary', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'serviceConditionsForOP', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'email', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'otherEmails', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'mockListing', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'ownersFullName', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'phoneNumber', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'aboutUs', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'qualifiedFromLIAccount', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'qualifiedBy', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'totalOfASINSAndVariations', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'callRecording', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'productCategory', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'paymentStatus', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'paymentType', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'plan', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'stage', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'averageMonthlyAmazonSales', {
          transaction,
        }),
        queryInterface.removeColumn(
          'leads',
          'averageMonthlyOutsideAmazonSales',
          {
            transaction,
          }
        ),
        queryInterface.removeColumn('leads', 'mainIssueWithAmazon', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'podId', {
          transaction,
        }),
      ]);
    });
  },
};
