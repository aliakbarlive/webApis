'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advCampaignRecords',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advCampaignRecords',
          'orders',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advAdGroupRecords',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advAdGroupRecords',
          'orders',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advKeywordRecords',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advKeywordRecords',
          'orders',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advTargetRecords',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advTargetRecords',
          'orders',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advSearchTermRecords',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advSearchTermRecords',
          'orders',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advProductAdRecords',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advProductAdRecords',
          'orders',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('advCampaignRecords', 'sales', {
          transaction,
        }),

        queryInterface.removeColumn('advCampaignRecords', 'orders', {
          transaction,
        }),

        queryInterface.removeColumn('advAdGroupRecords', 'sales', {
          transaction,
        }),

        queryInterface.removeColumn('advAdGroupRecords', 'orders', {
          transaction,
        }),

        queryInterface.removeColumn('advKeywordRecords', 'sales', {
          transaction,
        }),

        queryInterface.removeColumn('advKeywordRecords', 'orders', {
          transaction,
        }),

        queryInterface.removeColumn('advTargetRecords', 'sales', {
          transaction,
        }),

        queryInterface.removeColumn('advTargetRecords', 'orders', {
          transaction,
        }),

        queryInterface.removeColumn('advProductAdRecords', 'sales', {
          transaction,
        }),

        queryInterface.removeColumn('advProductAdRecords', 'orders', {
          transaction,
        }),

        queryInterface.removeColumn('advSearchTermRecords', 'sales', {
          transaction,
        }),

        queryInterface.removeColumn('advSearchTermRecords', 'orders', {
          transaction,
        }),
      ]);
    });
  },
};
