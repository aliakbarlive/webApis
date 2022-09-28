'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advOptimizations',
          'advOptimizationReportItemId',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizations',
          'advOptimizationReportRuleId',
          {
            type: Sequelize.BIGINT,
          },
          { transaction }
        ),

        queryInterface.changeColumn(
          'advOptimizations',
          'values',
          {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: {},
          },
          {
            transaction,
          }
        ),

        queryInterface.removeColumn('advOptimizations', 'rule', {
          transaction,
        }),

        queryInterface.changeColumn(
          'advOptimizations',
          'data',
          {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: {},
          },
          {
            transaction,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(
          'advOptimizations',
          'advOptimizationReportItemId',
          {
            transaction,
          }
        ),

        queryInterface.removeColumn(
          'advOptimizations',
          'advOptimizationReportRuleId',
          {
            transaction,
          }
        ),

        queryInterface.addColumn(
          'advOptimizations',
          'rule',
          {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: {},
          },
          {
            transaction,
          }
        ),
      ]);
    });
  },
};
