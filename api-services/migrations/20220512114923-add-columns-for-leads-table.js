'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'pitchDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'clientCreatedBy',
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
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'clientCreatedBy', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'pitchDate', {
          transaction,
        }),
      ]);
    });
  },
};
