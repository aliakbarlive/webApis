'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'roles',
          'groupLevel',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'roles',
          'allowPerGroup',
          {
            type: Sequelize.DataTypes.INTEGER,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('roles', 'groupLevel', { transaction: t }),

        queryInterface.removeColumn('roles', 'allowPerGroup', {
          transaction: t,
        }),
      ]);
    });
  },
};
