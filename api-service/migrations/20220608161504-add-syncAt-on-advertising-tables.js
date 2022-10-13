'use strict';

const advertisingTables = [
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
      return Promise.all(
        advertisingTables.map((table) => {
          return queryInterface.addColumn(
            table,
            'syncAt',
            { type: Sequelize.DATE },
            { transaction }
          );
        })
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all(
        advertisingTables.map((table) => {
          return queryInterface.removeColumn(table, 'syncAt', {
            transaction,
          });
        })
      );
    });
  },
};
