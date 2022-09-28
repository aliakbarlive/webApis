'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leadNotes',
          'addedBy',
          {
            type: Sequelize.UUID,
            allowNull: false,
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
        queryInterface.removeColumn('leadNotes', 'addedBy', {
          transaction,
        }),
      ]);
    });
  },
};
