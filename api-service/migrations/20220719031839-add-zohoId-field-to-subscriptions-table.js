'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'subscriptions',
          'planName',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'planCode',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'name',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'subscriptionNumber',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'amount',
          {
            type: Sequelize.FLOAT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'subTotal',
          {
            type: Sequelize.FLOAT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'isMeteredBilling',
          {
            type: Sequelize.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'zohoId',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'currentTermStartsAt',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'currentTermEndsAt',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'lastBillingAt',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'nextBillingAt',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'expiresAt',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'pauseDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'resumeDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'subscriptions',
          'autoCollect',
          {
            type: Sequelize.BOOLEAN,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('subscriptions', 'planName', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'planCode', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'name', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'subscriptionNumber', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'amount', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'subTotal', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'isMeteredBilling', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'zohoId', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'currentTermStartsAt', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'currentTermEndsAt', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'lastBillingAt', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'nextBillingAt', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'expiresAt', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'pauseDate', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'resumeDate', {
          transaction,
        }),
        queryInterface.removeColumn('subscriptions', 'autoCollect', {
          transaction,
        }),
      ]);
    });
  },
};
