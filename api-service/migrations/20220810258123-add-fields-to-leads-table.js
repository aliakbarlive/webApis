'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'pitcher',
          {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'users',
                schema: 'public',
              },
              key: 'userId',
            },
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'isInSales',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'pitcher', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'isInSales', {
          transaction,
        }),
      ]);
    });
  },
};
