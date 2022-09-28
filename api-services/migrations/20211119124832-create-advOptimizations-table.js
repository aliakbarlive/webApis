'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advOptimizations', {
      advOptimizationId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      advOptimizationBatchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advOptimizationBatches',
            schema: 'public',
          },
          key: 'advOptimizationBatchId',
        },
      },
      optimizableId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      optimizableType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      values: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      rule: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pending',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advOptimizations');
  },
};
