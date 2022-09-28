'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'agencyClients',
          'noCommission',
          {
            type: Sequelize.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'noCommissionReason',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('agencyClients', 'noCommission', {
          transaction,
        }),
        queryInterface.removeColumn('agencyClients', 'noCommissionReason', {
          transaction,
        }),
      ]);
    });
  },
};
