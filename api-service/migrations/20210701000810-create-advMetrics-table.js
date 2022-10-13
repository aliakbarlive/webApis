'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advMetrics', {
      advMetricId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: `case when SUM(records."{attr}") IS NULL THEN 0 else SUM(records."{attr}") end`,
      },
      cast: {
        type: Sequelize.ENUM('int', 'float'),
        allowNull: false,
        defaultValue: 'int',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advMetrics');
  },
};
