'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('users', 'roleId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'roles',
          schema: 'public',
        },
        key: 'roleId',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('users', 'roleId');
  },
};
