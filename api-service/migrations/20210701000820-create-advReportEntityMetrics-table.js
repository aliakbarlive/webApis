'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advReportEntityMetrics', {
      advReportEntityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advReportEntities',
            schema: 'public',
          },
          key: 'advReportEntityId',
        },
      },
      advMetricId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advMetrics',
            schema: 'public',
          },
          key: 'advMetricId',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advReportEntityMetrics');
  },
};
