'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('advOptimizationBatches', 'processedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('advOptimizationBatches', 'processedAt');
  },
};
