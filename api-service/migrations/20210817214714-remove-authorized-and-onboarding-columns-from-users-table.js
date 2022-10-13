'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('users', 'isSPAPIAuthorized', {
          transaction: t,
        }),
        queryInterface.removeColumn('users', 'isAdvAPIAuthorized', {
          transaction: t,
        }),
        queryInterface.removeColumn('users', 'isOnboarding', {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'isSPAPIAuthorized',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'users',
          'isAdvAPIAuthorized',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'users',
          'isOnboarding',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
