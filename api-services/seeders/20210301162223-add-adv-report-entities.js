'use strict';
const _ = require('lodash');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advReportEntityMetrics');

    await saveAdvReportEntites(queryInterface);

    await saveAdvMetrics(queryInterface);

    await saveAdvReportEntityMetrics(queryInterface);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advReportEntityMetrics');
    await queryInterface.bulkDelete('advMetrics');
    await queryInterface.bulkDelete('advReportEntities');
  },
};

const saveAdvReportEntites = async (queryInterface) => {
  await queryInterface.bulkDelete('advReportEntities');

  let advReportEntities = [
    {
      advReportEntityId: 1,
      campaignType: 'sponsoredProducts',
      recordType: 'campaigns',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 2,
      campaignType: 'sponsoredProducts',
      recordType: 'adGroups',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 3,
      campaignType: 'sponsoredProducts',
      recordType: 'productAds',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 4,
      campaignType: 'sponsoredProducts',
      recordType: 'targets',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 5,
      campaignType: 'sponsoredProducts',
      recordType: 'keywords',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 6,
      campaignType: 'sponsoredProducts',
      recordType: 'keywords',
      segment: 'query',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 7,
      campaignType: 'sponsoredProducts',
      recordType: 'targets',
      segment: 'query',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 8,
      campaignType: 'sponsoredBrands',
      recordType: 'campaigns',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 9,
      campaignType: 'sponsoredBrands',
      recordType: 'adGroups',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 10,
      campaignType: 'sponsoredBrands',
      recordType: 'keywords',
      hasSnapshot: true,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 11,
      campaignType: 'sponsoredDisplay',
      recordType: 'campaigns',
      tactic: 'T00020',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 12,
      campaignType: 'sponsoredDisplay',
      recordType: 'campaigns',
      tactic: 'T00030',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 13,
      campaignType: 'sponsoredDisplay',
      recordType: 'campaigns',
      tactic: 'remarketing',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 14,
      campaignType: 'sponsoredDisplay',
      recordType: 'adGroups',
      tactic: 'T00020',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 15,
      campaignType: 'sponsoredDisplay',
      recordType: 'adGroups',
      tactic: 'T00030',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 16,
      campaignType: 'sponsoredDisplay',
      recordType: 'adGroups',
      tactic: 'remarketing',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 17,
      campaignType: 'sponsoredDisplay',
      recordType: 'productAds',
      tactic: 'T00020',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 18,
      campaignType: 'sponsoredDisplay',
      recordType: 'productAds',
      tactic: 'T00030',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 19,
      campaignType: 'sponsoredDisplay',
      recordType: 'productAds',
      tactic: 'remarketing',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 20,
      campaignType: 'sponsoredDisplay',
      recordType: 'targets',
      tactic: 'T00020',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 21,
      campaignType: 'sponsoredDisplay',
      recordType: 'targets',
      tactic: 'T00030',
      hasSnapshot: false,
      hasPerformanceReport: true,
    },
    {
      advReportEntityId: 22,
      campaignType: 'sponsoredDisplay',
      recordType: 'campaigns',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
    {
      advReportEntityId: 23,
      campaignType: 'sponsoredDisplay',
      recordType: 'adGroups',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
    {
      advReportEntityId: 24,
      campaignType: 'sponsoredDisplay',
      recordType: 'targets',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
    {
      advReportEntityId: 25,
      campaignType: 'sponsoredDisplay',
      recordType: 'productAds',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
    {
      advReportEntityId: 26,
      campaignType: 'sponsoredProducts',
      recordType: 'negativeKeywords',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
    {
      advReportEntityId: 27,
      campaignType: 'sponsoredProducts',
      recordType: 'campaignNegativeKeywords',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
    {
      advReportEntityId: 28,
      campaignType: 'sponsoredProducts',
      recordType: 'negativeTargets',
      hasSnapshot: true,
      hasPerformanceReport: false,
    },
  ];

  let marketPlace = [
    'CA',
    'US',
    'MX',
    'BR',
    'DE',
    'ES',
    'FR',
    'IT',
    'NL',
    'UK',
    'KSA',
    'UAE',
    'AU',
    'IN',
    'JP',
  ];

  const exclude = ['MX', 'BR', 'NL', 'KSA', 'AU'];

  advReportEntities = advReportEntities.map((reportEntity) => {
    if (reportEntity.campaignType == 'sponsoredDisplay') {
      marketPlace = marketPlace.filter((m) => !exclude.includes(m));
    }

    return {
      ...reportEntity,
      marketPlace,
    };
  });

  return queryInterface.bulkInsert('advReportEntities', advReportEntities, {
    ignoreDuplicates: true,
  });
};

const saveAdvMetrics = async (queryInterface) => {
  let advMetrics = [
    { advMetricId: 1, name: 'impressions' },
    { advMetricId: 2, name: 'clicks' },
    { advMetricId: 3, name: 'cost' },
    { advMetricId: 4, name: 'attributedConversions1d' },
    { advMetricId: 5, name: 'attributedConversions7d' },
    { advMetricId: 6, name: 'attributedConversions14d' },
    { advMetricId: 7, name: 'attributedConversions30d' },
    { advMetricId: 8, name: 'attributedConversions1dSameSKU' },
    { advMetricId: 9, name: 'attributedConversions7dSameSKU' },
    { advMetricId: 10, name: 'attributedConversions14dSameSKU' },
    { advMetricId: 11, name: 'attributedConversions30dSameSKU' },
    { advMetricId: 12, name: 'attributedUnitsOrdered1d' },
    { advMetricId: 13, name: 'attributedUnitsOrdered7d' },
    { advMetricId: 14, name: 'attributedUnitsOrdered14d' },
    { advMetricId: 15, name: 'attributedUnitsOrdered30d' },
    { advMetricId: 16, name: 'attributedSales1d', cast: 'float' },
    { advMetricId: 17, name: 'attributedSales7d', cast: 'float' },
    { advMetricId: 18, name: 'attributedSales14d', cast: 'float' },
    { advMetricId: 19, name: 'attributedSales30d', cast: 'float' },
    { advMetricId: 20, name: 'attributedSales1dSameSKU', cast: 'float' },
    { advMetricId: 21, name: 'attributedSales7dSameSKU', cast: 'float' },
    { advMetricId: 22, name: 'attributedSales14dSameSKU', cast: 'float' },
    { advMetricId: 23, name: 'attributedSales30dSameSKU', cast: 'float' },
    { advMetricId: 24, name: 'attributedUnitsOrdered1dSameSKU' },
    { advMetricId: 25, name: 'attributedUnitsOrdered7dSameSKU' },
    { advMetricId: 26, name: 'attributedUnitsOrdered14dSameSKU' },
    { advMetricId: 27, name: 'attributedUnitsOrdered30dSameSKU' },
    { advMetricId: 28, name: 'attributedDPV14d' },
    { advMetricId: 29, name: 'attributedUnitsSold14d' },
    { advMetricId: 30, name: 'attributedDetailPageViewsClicks14d' },
    { advMetricId: 31, name: 'attributedOrdersNewToBrand14d' },
    {
      advMetricId: 32,
      name: 'attributedOrdersNewToBrandPercentage14d',
      cast: 'float',
    },
    {
      advMetricId: 33,
      name: 'attributedOrderRateNewToBrand14d',
      cast: 'float',
    },
    { advMetricId: 34, name: 'attributedSalesNewToBrand14d' },
    {
      advMetricId: 35,
      name: 'attributedSalesNewToBrandPercentage14d',
      cast: 'float',
    },
    { advMetricId: 36, name: 'attributedUnitsOrderedNewToBrand14d' },
    {
      advMetricId: 37,
      name: 'attributedUnitsOrderedNewToBrandPercentage14d',
      cast: 'float',
    },
    { advMetricId: 38, name: 'unitsSold14d' },
    { advMetricId: 39, name: 'dpv14d' },
    {
      advMetricId: 40,
      name: 'acos',
      cast: 'float',
      query: `case when SUM(records."sales") = 0 OR SUM(records."sales") IS NULL THEN 0 else ROUND((SUM(records."cost") / SUM(records."sales")), 4) end`,
    },
    {
      advMetricId: 41,
      name: 'cpc',
      cast: 'float',
      query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND(SUM(records."cost") / SUM(records."clicks"), 2) end`,
    },
    {
      advMetricId: 42,
      name: 'ctr',
      cast: 'float',
      query: `case when SUM(records.impressions) = 0 OR SUM(records."impressions") IS NULL then 0 else ROUND((SUM(CAST(records.clicks as decimal)) / SUM(records.impressions)), 4) end`,
    },
    {
      advMetricId: 43,
      name: 'cr',
      cast: 'float',
      query: `case when SUM(records."clicks") = 0 OR SUM(records."clicks") IS NULL then 0 else ROUND((SUM(CAST(records."orders" as decimal)) / SUM(records."clicks")), 4) end`,
    },
  ];

  advMetrics = advMetrics.map((advMetric) => {
    advMetric.cast = advMetric.cast ?? 'int';
    advMetric.query =
      advMetric.query ??
      `case when SUM(records."{attr}") IS NULL THEN 0 else SUM(records."{attr}") end`;

    return advMetric;
  });

  return queryInterface.bulkInsert('advMetrics', advMetrics, {
    ignoreDuplicates: true,
  });
};

const saveAdvReportEntityMetrics = async (queryInterface) => {
  let advReportEntityMetrics = [];

  const advReportEntities = [
    {
      advReportEntityId: 1,
      metrics: '1-27',
    },
    {
      advReportEntityId: 2,
      metrics: '1-27',
    },
    {
      advReportEntityId: 3,
      metrics: '1-27',
    },
    {
      advReportEntityId: 4,
      metrics: '1-27',
    },
    {
      advReportEntityId: 5,
      metrics: '1-27',
    },
    {
      advReportEntityId: 6,
      metrics: '1-27',
    },
    {
      advReportEntityId: 7,
      metrics: '1-27',
    },
    {
      advReportEntityId: 8,
      metrics: '1-3,6,10,18,22,30-39',
    },
    {
      advReportEntityId: 9,
      metrics: '1-3,6,10,18,22,30-39',
    },
    {
      advReportEntityId: 10,
      metrics: '1-3,6,10,18,22,30-39',
    },
    {
      advReportEntityId: 11,
      metrics: '1-23',
    },
    {
      advReportEntityId: 12,
      metrics: '1-23',
    },
    {
      advReportEntityId: 13,
      metrics: '1-23',
    },
    {
      advReportEntityId: 14,
      metrics: '1-23',
    },
    {
      advReportEntityId: 15,
      metrics: '1-23',
    },
    {
      advReportEntityId: 16,
      metrics: '1-23',
    },
    {
      advReportEntityId: 17,
      metrics: '1-23',
    },
    {
      advReportEntityId: 18,
      metrics: '1-23',
    },
    {
      advReportEntityId: 19,
      metrics: '1-23',
    },
    {
      advReportEntityId: 20,
      metrics: '1-23',
    },
    {
      advReportEntityId: 21,
      metrics: '1-23',
    },
  ];

  advReportEntities.map((advReportEntity) => {
    advReportEntity.metrics
      .split(',')
      .map((metricSummary) => {
        if (metricSummary.includes('-')) {
          const [start, end] = metricSummary.split('-');
          return _.range(parseInt(start), parseInt(end) + 1);
        }
        return [parseInt(metricSummary)];
      })
      .forEach((metricIds) => {
        metricIds.forEach((id) =>
          advReportEntityMetrics.push({
            advReportEntityId: advReportEntity.advReportEntityId,
            advMetricId: id,
          })
        );
      });
  });

  return queryInterface.bulkInsert(
    'advReportEntityMetrics',
    advReportEntityMetrics
  );
};
