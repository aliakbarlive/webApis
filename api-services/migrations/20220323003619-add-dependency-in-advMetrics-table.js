'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('advMetrics', 'dependencies', {
      type: Sequelize.STRING,
      defaultValue: '',
    });

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'cost,clicks',
      },
      { name: 'cpc' }
    );

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'impressions,clicks',
        query: `case when SUM(records."impressions") = 0 OR SUM(records."impressions") IS NULL then 0 else ROUND((SUM(CAST(records."clicks" as decimal)) / SUM(records."impressions")), 4) end`,
      },
      { name: 'ctr' }
    );

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'orders,clicks',
      },
      { name: 'cr' }
    );

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'sales,cost',
      },
      { name: 'profit' }
    );

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'sales,cost',
      },
      { name: 'acos' }
    );

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'sales,cost',
      },
      { name: 'acos' }
    );

    await queryInterface.bulkUpdate(
      'advMetrics',
      {
        dependencies: 'sales,orders',
      },
      { name: 'aov' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('advMetrics', 'dependencies');
  },
};
