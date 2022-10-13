'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'linkedInAccounts',
          'gender',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'linkedInAccounts',
          'category',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'linkedInAccounts',
          'counter',
          {
            type: Sequelize.INTEGER,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('linkedInAccounts', 'gender', {
          transaction,
        }),
        queryInterface.removeColumn('linkedInAccounts', 'category', {
          transaction,
        }),
        queryInterface.removeColumn('linkedInAccounts', 'counter', {
          transaction,
        }),
      ]);
    });
  },
};
