'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('roles', 'level', {
      type: Sequelize.ENUM('application', 'agency', 'account'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('roles', 'level');

    await queryInterface.sequelize.query('DROP TYPE "enum_roles_level";');
  },
};
