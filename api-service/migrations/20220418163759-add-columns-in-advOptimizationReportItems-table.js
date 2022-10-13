'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advOptimizationReportItems',
          'unitsSold',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizationReportItems',
          'cpm',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizationReportItems',
          'cpcon',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizationReportItems',
          'sales',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizationReportItems',
          'orders',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizationReportItems',
          'aov',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advOptimizationReportItems',
          'roas',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('advOptimizationReportItems', 'unitsSold', {
          transaction,
        }),
        queryInterface.removeColumn('advOptimizationReportItems', 'cpm', {
          transaction,
        }),
        queryInterface.removeColumn('advOptimizationReportItems', 'sales', {
          transaction,
        }),
        queryInterface.removeColumn('advOptimizationReportItems', 'orders', {
          transaction,
        }),
        queryInterface.removeColumn('advOptimizationReportItems', 'aov', {
          transaction,
        }),
        queryInterface.removeColumn('advOptimizationReportItems', 'cpcon', {
          transaction,
        }),
        queryInterface.removeColumn('advOptimizationReportItems', 'roas', {
          transaction,
        }),
      ]);
    });
  },
};
