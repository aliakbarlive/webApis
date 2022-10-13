'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'advSearchTerms',
          'advCampaignId',
          { type: Sequelize.BIGINT },
          { transaction }
        ),

        queryInterface.changeColumn(
          'advSearchTerms',
          'advAdGroupId',
          { type: Sequelize.BIGINT },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
