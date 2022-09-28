'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert(
          'advMetrics',
          [
            {
              advMetricId: 48,
              name: 'unitsSold',
              query: `case when SUM(records."unitsSold") IS NULL THEN 0 else SUM(records."unitsSold") end`,
              cast: 'int',
            },
            {
              advMetricId: 49,
              name: 'cpm',
              query: `case when SUM(records."impressions") = 0 OR SUM(records."impressions") IS NULL then 0 else ROUND(SUM(records."cost") / (SUM(records."impressions") / 1000), 2) end`,
              cast: 'float',
            },
            {
              advMetricId: 50,
              name: 'cpcon',
              query: `case when SUM(records."orders") = 0 OR SUM(records."orders") IS NULL then 0 else ROUND(SUM(records."cost") / SUM(records."orders"), 2) end`,
              cast: 'float',
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
        queryInterface.bulkDelete(
          'advMetrics',
          {
            name: 'unitsSold',
          },
          { transaction }
        ),

        queryInterface.bulkDelete(
          'advMetrics',
          {
            name: 'cpm',
          },
          { transaction }
        ),

        queryInterface.bulkDelete(
          'advMetrics',
          {
            name: 'cpcon',
          },
          { transaction }
        ),
      ]);
    });
  },
};
