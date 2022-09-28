'use strict';

const newMetrics = [
  {
    advMetricId: 52,
    name: 'viewAttributedConversions14d',
  },
  {
    advMetricId: 53,
    name: 'viewAttributedDetailPageView14d',
  },
  {
    advMetricId: 54,
    name: 'viewAttributedSales14d',
  },
  {
    advMetricId: 55,
    name: 'viewAttributedUnitsOrdered14d',
  },
  {
    advMetricId: 56,
    name: 'viewImpressions',
  },
  {
    advMetricId: 57,
    name: 'viewAttributedOrdersNewToBrand14d',
  },
  {
    advMetricId: 58,
    name: 'viewAttributedSalesNewToBrand14d',
  },
  {
    advMetricId: 59,
    name: 'viewAttributedUnitsOrderedNewToBrand14d',
  },
  {
    advMetricId: 60,
    name: 'attributedBrandedSearches14d',
  },
  {
    advMetricId: 61,
    name: 'viewAttributedBrandedSearches14d',
  },
  {
    advMetricId: 62,
    name: 'costType',
  },
].map((metric) => {
  metric.cast = metric.cast ?? 'int';
  metric.query =
    metric.query ??
    `case when SUM(records."{attr}") IS NULL THEN 0 else SUM(records."{attr}") end`;

  return metric;
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let reportEntityMetrics = [];

    for (
      let advReportEntityId = 11;
      advReportEntityId <= 13;
      advReportEntityId++
    ) {
      for (let advMetricId = 52; advMetricId <= 62; advMetricId++) {
        reportEntityMetrics.push({ advReportEntityId, advMetricId });
      }
    }

    await queryInterface.bulkInsert('advMetrics', newMetrics);

    await queryInterface.bulkInsert(
      'advReportEntityMetrics',
      reportEntityMetrics
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        newMetrics.map((metric) =>
          queryInterface.bulkDelete(
            'advReportEntityMetrics',
            {
              advMetricId: metric.advMetricId,
            },
            { transaction }
          )
        ),
      ]);
    });

    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        newMetrics.map((metric) =>
          queryInterface.bulkDelete(
            'advMetrics',
            {
              name: metric.name,
            },
            { transaction }
          )
        ),
      ]);
    });
  },
};
