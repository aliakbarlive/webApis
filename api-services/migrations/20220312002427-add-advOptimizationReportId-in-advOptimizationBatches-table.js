'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'advOptimizationBatches',
      'advOptimizationReportId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'advOptimizationBatches',
      'advOptimizationReportId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },
};
