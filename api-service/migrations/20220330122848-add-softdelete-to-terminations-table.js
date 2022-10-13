'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('terminations', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('terminations', 'deletedAt');
  },
};
