'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'invoices',
          'writeOffAmount',
          {
            type: Sequelize.FLOAT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'invoices',
          'creditsApplied',
          {
            type: Sequelize.FLOAT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'invoices',
          'paymentMade',
          {
            type: Sequelize.FLOAT,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('invoices', 'writeOffAmount', {
          transaction,
        }),
        queryInterface.removeColumn('invoices', 'creditsApplied', {
          transaction,
        }),
        queryInterface.removeColumn('invoices', 'paymentMade', {
          transaction,
        }),
      ]);
    });
  },
};
