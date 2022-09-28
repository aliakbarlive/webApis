'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'invites',
          'accountId',
          {
            type: Sequelize.DataTypes.UUID,
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
        queryInterface.addColumn(
          'invites',
          'roleId',
          {
            type: Sequelize.DataTypes.INTEGER,
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
        queryInterface.addColumn(
          'invites',
          'inviteToken',
          {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'inviteExpire',
          {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('invites', 'accountId', { transaction: t }),

        queryInterface.removeColumn('invites', 'roleId', {
          transaction: t,
        }),

        queryInterface.removeColumn('invites', 'inviteToken', {
          transaction: t,
        }),

        queryInterface.removeColumn('invites', 'inviteExpire', {
          transaction: t,
        }),
      ]);
    });
  },
};
