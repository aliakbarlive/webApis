'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'subscriptions',
          'updateToken',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'updateTokenExpire',
          {
            type: Sequelize.DATE,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('subscriptions', 'updateTokenExpire', {
          transaction: t,
        }),
        queryInterface.removeColumn('subscriptions', 'updateToken', {
          transaction: t,
        }),
      ]);
    });
  },
};
