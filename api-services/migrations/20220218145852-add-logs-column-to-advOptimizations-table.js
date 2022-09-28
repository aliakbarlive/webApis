'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('advOptimizations', 'logs', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('advOptimizations', 'errorMessage', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('advOptimizations', 'logs');

    await queryInterface.removeColumn('advOptimizations', 'errorMessage');
  },
};
