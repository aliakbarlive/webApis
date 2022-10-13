'use strict';

const asyncHandler = require('../middleware/async');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // add accountId column
        queryInterface.addColumn(
          'subscriptions',
          'accountId',
          {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'accounts',
                schema: 'public',
              },
              key: 'accountId',
            },
          },
          { transaction: t }
        ),
        // remove agencyClientId column
        queryInterface.removeColumn('subscriptions', 'agencyClientId', {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // remove accountId column
        queryInterface.removeColumn('subscriptions', 'accountId', {
          transaction: t,
        }),
        // restore agencyClientID column
        queryInterface.addColumn(
          'subscriptions',
          'agencyClientId',
          {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'agencyClients',
                schema: 'public',
              },
              key: 'agencyClientId',
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
