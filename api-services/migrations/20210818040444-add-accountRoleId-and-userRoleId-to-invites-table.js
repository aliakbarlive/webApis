'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'invites',
          'accountRoleId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'roles',
                schema: 'public',
              },
              key: 'roleId',
            },
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'userRoleId',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: 'roles',
                schema: 'public',
              },
              key: 'roleId',
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('invites', 'accountRoleId', {
          transaction: t,
        }),
        queryInterface.removeColumn('invites', 'userRoleId', {
          transaction: t,
        }),
      ]);
    });
  },
};
