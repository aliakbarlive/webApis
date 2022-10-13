'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advCampaignRecords',
          'unitsSold',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advAdGroupRecords',
          'unitsSold',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advKeywordRecords',
          'unitsSold',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advTargetRecords',
          'unitsSold',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advSearchTermRecords',
          'unitsSold',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advProductAdRecords',
          'unitsSold',
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
        queryInterface.removeColumn('advCampaignRecords', 'unitsSold', {
          transaction,
        }),

        queryInterface.removeColumn('advAdGroupRecords', 'unitsSold', {
          transaction,
        }),

        queryInterface.removeColumn('advKeywordRecords', 'unitsSold', {
          transaction,
        }),

        queryInterface.removeColumn('advTargetRecords', 'unitsSold', {
          transaction,
        }),

        queryInterface.removeColumn('advProductAdRecords', 'unitsSold', {
          transaction,
        }),

        queryInterface.removeColumn('advSearchTermRecords', 'unitsSold', {
          transaction,
        }),
      ]);
    });
  },
};
