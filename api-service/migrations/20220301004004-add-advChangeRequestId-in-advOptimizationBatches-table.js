'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'advOptimizationBatches',
      'advChangeRequestId',
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          key: 'advChangeRequestId',
          model: { tableName: 'advChangeRequests', schema: 'public' },
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'advOptimizationBatches',
      'advChangeRequestId'
    );
  },
};
