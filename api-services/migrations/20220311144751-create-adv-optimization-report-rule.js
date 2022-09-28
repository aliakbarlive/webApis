'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advOptimizationReportRules', {
      advOptimizationReportRuleId: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      advOptimizationReportId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advOptimizationReports', schema: 'public' },
          key: 'advOptimizationReportId',
        },
      },
      advRuleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filters: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      advRuleActionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advRuleActions',
            schema: 'public',
          },
          key: 'advRuleActionId',
        },
      },
      actionData: {
        type: Sequelize.JSONB,
      },
      products: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      campaigns: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advOptimizationReportRules');
  },
};
