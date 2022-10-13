'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('invites', 'agencyClientId', {
          transaction: t,
        }),

        queryInterface.removeColumn('invites', 'inviteEmailExpire', {
          transaction: t,
        }),

        queryInterface.removeColumn('invites', 'status', {
          transaction: t,
        }),
        queryInterface.removeColumn('invites', 'sentAt', {
          transaction: t,
        }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'invites',
          'agencyClientId',
          {
            type: Sequelize.DataTypes.UUID,
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
        queryInterface.addColumn(
          'invites',
          'inviteEmailExpire',
          {
            type: Sequelize.DataTypes.DATE,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'status',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'sentAt',
          {
            type: Sequelize.DataTypes.DATE,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
