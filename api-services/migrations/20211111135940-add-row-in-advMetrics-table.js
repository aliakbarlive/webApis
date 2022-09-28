'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('advMetrics', [
      {
        advMetricId: 44,
        name: 'profit',
        query: `case 
            when SUM(records."cost") IS NULL AND SUM(records."{salesAttribute}") IS NULL THEN 0
            when SUM(records."cost") IS NULL AND SUM(records."{salesAttribute}") IS NOT NULL THEN ROUND(SUM(records."{salesAttribute}") - 0, 2)
            when SUM(records."cost") IS NOT NULL AND SUM(records."{salesAttribute}") IS NULL THEN ROUND(0 - SUM(records."cost"), 2)
            when SUM(records."cost") IS NOT NULL AND SUM(records."{salesAttribute}") IS NOT NULL THEN ROUND(SUM(records."{salesAttribute}") - SUM(records."cost"), 2)
            else 0
          end
        `,
        cast: 'float',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advMetrics', {
      name: 'profit',
    });
  },
};
