'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advSearchTerms',
          'advCampaignId',
          { type: Sequelize.BIGINT },
          { transaction }
        ),

        queryInterface.addColumn(
          'advSearchTerms',
          'advAdGroupId',
          { type: Sequelize.BIGINT },
          { transaction }
        ),

        queryInterface.addColumn(
          'advSearchTerms',
          'target',
          {
            type: Sequelize.ENUM('product', 'keyword'),
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('advSearchTerms', 'advCampaignId', {
          transaction,
        }),

        queryInterface.removeColumn('advSearchTerms', 'advAdGroupId', {
          transaction,
        }),

        queryInterface.removeColumn('advSearchTerms', 'target', {
          transaction,
        }),
      ]);
    });
  },
};
