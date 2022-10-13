'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'invites',
          'isPpc',
          {
            type: Sequelize.BOOLEAN,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'departmentId',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'squadId',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'podId',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'invites',
          'cellId',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('invites', 'isPpc', {
          transaction: t,
        }),
        queryInterface.removeColumn('invites', 'departmentId', {
          transaction: t,
        }),
        queryInterface.removeColumn('invites', 'squadId', {
          transaction: t,
        }),
        queryInterface.removeColumn('invites', 'podId', {
          transaction: t,
        }),
        queryInterface.removeColumn('invites', 'cellId', {
          transaction: t,
        }),
      ]);
    });
  },
};
