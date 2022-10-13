'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'linkedInAccountId',
          {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'linkedInAccounts',
                schema: 'public',
              },
              key: 'linkedInAccountId',
            },
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'linkedInAccountId', {
          transaction,
        }),
      ]);
    });
  },
};
