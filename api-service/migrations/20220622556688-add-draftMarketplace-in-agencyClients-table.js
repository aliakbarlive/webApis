'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'agencyClients',
          'draftMarketplace',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('agencyClients', 'draftMarketplace', {
          transaction,
        }),
      ]);
    });
  },
};
