'use strict';

const advertisingTables = [
  'advCampaigns',
  'advAdGroups',
  'advKeywords',
  'advTargets',
  'advProductAds',
  'advNegativeTargets',
  'advNegativeKeywords',
  'advCampaignNegativeKeywords',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        ...advertisingTables.map((table) => {
          return queryInterface.addColumn(
            table,
            'creationDate',
            { type: Sequelize.BIGINT },
            { transaction }
          );
        }),

        ...advertisingTables.map((table) => {
          return queryInterface.addColumn(
            table,
            'lastUpdatedDate',
            { type: Sequelize.BIGINT },
            { transaction }
          );
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        ...advertisingTables.map((table) => {
          return queryInterface.removeColumn(table, 'creationDate', {
            transaction,
          });
        }),
        ...advertisingTables.map((table) => {
          return queryInterface.removeColumn(table, 'lastUpdatedDate', {
            transaction,
          });
        }),
      ]);
    });
  },
};
