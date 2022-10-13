'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert(
          'advMetrics',
          [
            {
              advMetricId: 51,
              name: 'roas',
              query: `CASE WHEN SUM("cost") IS NULL AND SUM("sales") IS NULL THEN 0 WHEN SUM("cost") IS NULL AND SUM("sales") IS NOT NULL AND SUM("sales") > 0 THEN ROUND((SUM("sales") - 0) / SUM("sales"), 4) WHEN SUM("cost") IS NOT NULL AND SUM("sales") IS NULL THEN 0 WHEN SUM("cost") IS NOT NULL AND SUM("sales") IS NOT NULL AND SUM("sales") > 0 THEN ROUND((SUM("sales") - SUM("cost")) / SUM("sales"), 4) ELSE 0 END`,
              cast: 'float',
              dependencies: 'sales,cost',
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
            name: 'roas',
          },
          { transaction }
        ),
      ]);
    });
  },
};
