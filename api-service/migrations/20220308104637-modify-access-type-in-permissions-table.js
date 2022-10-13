'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'permissions',
          'access',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'permissions',
          'access',
          {
            type: Sequelize.ENUM({
              values: ['create', 'read', 'update', 'delete'],
            }),
            allowNull: false,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
