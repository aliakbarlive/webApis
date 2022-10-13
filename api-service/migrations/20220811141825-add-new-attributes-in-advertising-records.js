'use strict';

const columns = [
  'viewAttributedConversions14d',
  'viewAttributedDetailPageView14d',
  'viewAttributedSales14d',
  'viewAttributedUnitsOrdered14d',
  'viewImpressions',
  'viewAttributedOrdersNewToBrand14d',
  'viewAttributedSalesNewToBrand14d',
  'viewAttributedUnitsOrderedNewToBrand14d',
  'attributedBrandedSearches14d',
  'viewAttributedBrandedSearches14d',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advCampaignRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advAdGroupRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advKeywordRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advTargetRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advSearchTermRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advProductAdRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
        ...columns.map((col) =>
          queryInterface.addColumn(
            'advTargetingRecords',
            col,
            {
              type: col.includes('Sales')
                ? Sequelize.DECIMAL
                : Sequelize.INTEGER,
              defaultValue: 0,
            },
            { transaction }
          )
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        ...columns.map((col) =>
          queryInterface.removeColumn('advCampaignRecords', col, {
            transaction,
          })
        ),
        ...columns.map((col) =>
          queryInterface.removeColumn('advAdGroupRecords', col, {
            transaction,
          })
        ),
        ...columns.map((col) =>
          queryInterface.removeColumn('advKeywordRecords', col, {
            transaction,
          })
        ),
        ...columns.map((col) =>
          queryInterface.removeColumn('advTargetRecords', col, {
            transaction,
          })
        ),
        ...columns.map((col) =>
          queryInterface.removeColumn('advProductAdRecords', col, {
            transaction,
          })
        ),
        ...columns.map((col) =>
          queryInterface.removeColumn('advSearchTermRecords', col, {
            transaction,
          })
        ),
        ...columns.map((col) =>
          queryInterface.removeColumn('advTargetingRecords', col, {
            transaction,
          })
        ),
      ]);
    });
  },
};
