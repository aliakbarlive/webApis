'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND((SUM(CAST(records."{ordersAttribute}" as decimal)) / SUM(records."clicks")), 4) end`,
      },
      {
        name: 'cr',
      }
    );

    await queryInterface.bulkInsert('advMetrics', [
      {
        advMetricId: 45,
        name: 'aov',
        query: `case when SUM(records."{ordersAttribute}") = 0 OR SUM(records."{ordersAttribute}") IS NULL then 0 else ROUND(SUM(records."{salesAttribute}") / SUM(records."{ordersAttribute}"), 2) end`,
        cast: 'float',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advMetrics', {
      name: 'aov',
    });

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND((SUM(CAST(records."{conversionsAttribute}" as decimal)) / SUM(records."clicks")), 4) end`,
      },
      {
        name: 'cr',
      }
    );
  },
};
