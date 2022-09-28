'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advOptimizationReportItemOptions', {
      advOptimizationReportItemOptionId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      advOptimizationReportItemId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      advOptimizationReportRuleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      data: {
        defaultValue: {},
        type: Sequelize.JSONB,
      },
      selected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('advOptimizationReportItemOptions');
  },
};
