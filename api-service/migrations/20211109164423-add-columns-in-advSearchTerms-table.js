'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'advSearchTerms',
          'convertedAsNegativeKeyword',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'advSearchTerms',
          'convertedAsCampaignNegativeKeyword',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'advSearchTerms',
          'convertedAsNegativeKeyword',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn(
          'advSearchTerms',
          'convertedAsCampaignNegativeKeyword',
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
