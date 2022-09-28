'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND((SUM(CAST(records."orders" as decimal)) / SUM(records."clicks")), 4) end`,
          },
          {
            name: 'cr',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `
            case
              when SUM(records."cost") IS NULL AND SUM(records."sales") IS NULL THEN 0
              when SUM(records."cost") IS NULL AND SUM(records."sales") IS NOT NULL THEN ROUND(SUM(records."sales") - 0, 2)
              when SUM(records."cost") IS NOT NULL AND SUM(records."sales") IS NULL THEN ROUND(0 - SUM(records."cost"), 2)
              when SUM(records."cost") IS NOT NULL AND SUM(records."sales") IS NOT NULL THEN ROUND(SUM(records."sales") - SUM(records."cost"), 2)
              else 0
            end
            `,
          },
          {
            name: 'profit',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `case when SUM(records."sales") = 0 OR SUM(records."sales") IS NULL THEN 0 else ROUND((SUM(records."cost") / SUM(records."sales")), 4) end`,
          },
          {
            name: 'acos',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `case when SUM(records."orders") = 0 OR SUM(records."orders") IS NULL then 0 else ROUND(SUM(records."sales") / SUM(records."orders"), 2) end`,
          },
          {
            name: 'aov',
          },
          { transaction }
        ),

        queryInterface.bulkInsert(
          'advMetrics',
          [
            {
              advMetricId: 46,
              name: 'sales',
              query: `case when SUM(records."sales") IS NULL THEN 0 else SUM(records."sales") end`,
              cast: 'float',
            },
            {
              advMetricId: 47,
              name: 'orders',
              query: `case when SUM(records."orders") IS NULL THEN 0 else SUM(records."orders") end`,
              cast: 'int',
            },
          ],
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND((SUM(CAST(records."{ordersAttribute}" as decimal)) / SUM(records."clicks")), 4) end`,
          },
          {
            name: 'cr',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND((SUM(CAST(records."{ordersAttribute}" as decimal)) / SUM(records."clicks")), 4) end`,
          },
          {
            name: 'profit',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `
            case
              when SUM(records."cost") IS NULL AND SUM(records."{salesAttribute}") IS NULL THEN 0
              when SUM(records."cost") IS NULL AND SUM(records."{salesAttribute}") IS NOT NULL THEN ROUND(SUM(records."{salesAttribute}") - 0, 2)
              when SUM(records."cost") IS NOT NULL AND SUM(records."{salesAttribute}") IS NULL THEN ROUND(0 - SUM(records."cost"), 2)
              when SUM(records."cost") IS NOT NULL AND SUM(records."{salesAttribute}") IS NOT NULL THEN ROUND(SUM(records."{salesAttribute}") - SUM(records."cost"), 2)
              else 0
            end
            `,
          },
          {
            name: 'acos',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advMetrics',
          {
            query: `case when SUM(records."{ordersAttribute}") = 0 OR SUM(records."{ordersAttribute}") IS NULL then 0 else ROUND(SUM(records."{salesAttribute}") / SUM(records."{ordersAttribute}"), 2) end`,
          },
          {
            name: 'aov',
          },
          { transaction }
        ),

        queryInterface.bulkDelete(
          'advMetrics',
          {
            name: 'sales',
          },
          { transaction }
        ),

        queryInterface.bulkDelete(
          'advMetrics',
          {
            name: 'orders',
          },
          { transaction }
        ),
      ]);
    });
  },
};
