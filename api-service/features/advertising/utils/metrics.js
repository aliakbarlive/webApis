const metrics = [
  { name: 'impressions', cast: 'int' },
  { name: 'clicks', cast: 'int' },
  { name: 'attributedConversions1d', cast: 'int' },
  { name: 'attributedConversions7d', cast: 'int' },
  { name: 'attributedConversions14d', cast: 'int' },
  { name: 'attributedConversions30d', cast: 'int' },
  { name: 'attributedConversions1dSameSKU', cast: 'int' },
  { name: 'attributedConversions7dSameSKU', cast: 'int' },
  { name: 'attributedConversions14dSameSKU', cast: 'int' },
  { name: 'attributedConversions30dSameSKU', cast: 'int' },
  { name: 'attributedUnitsOrdered1d', cast: 'int' },
  { name: 'attributedUnitsOrdered7d', cast: 'int' },
  { name: 'attributedUnitsOrdered14d', cast: 'int' },
  { name: 'attributedUnitsOrdered30d', cast: 'int' },
  { name: 'attributedSales1d', cast: 'float' },
  { name: 'attributedSales7d', cast: 'float' },
  { name: 'attributedSales14d', cast: 'float' },
  { name: 'attributedSales30d', cast: 'float' },
  { name: 'attributedSales1dSameSKU', cast: 'float' },
  { name: 'attributedSales7dSameSKU', cast: 'float' },
  { name: 'attributedSales14dSameSKU', cast: 'float' },
  { name: 'attributedSales30dSameSKU', cast: 'float' },
  { name: 'attributedUnitsOrdered1dSameSKU', cast: 'int' },
  { name: 'attributedUnitsOrdered7dSameSKU', cast: 'int' },
  { name: 'attributedUnitsOrdered14dSameSKU', cast: 'int' },
  { name: 'attributedUnitsOrdered30dSameSKU', cast: 'int' },
  { name: 'attributedDPV14d', cast: 'int' },
  { name: 'attributedUnitsSold14d', cast: 'int' },
  { name: 'attributedDetailPageViewsClicks14d', cast: 'int' },
  { name: 'attributedOrdersNewToBrand14d', cast: 'int' },
  { name: 'attributedOrdersNewToBrandPercentage14d', cast: 'float' },
  { name: 'attributedOrderRateNewToBrand14d', cast: 'float' },
  { name: 'attributedSalesNewToBrand14d', cast: 'int' },
  { name: 'attributedSalesNewToBrandPercentage14d', cast: 'float' },
  { name: 'attributedUnitsOrderedNewToBrand14d', cast: 'int' },
  { name: 'attributedUnitsOrderedNewToBrandPercentage14d', cast: 'float' },
  { name: 'unitsSold14d', cast: 'int' },
  { name: 'dpv14d', cast: 'int' },
  { name: 'cost', cast: 'float' },
  { name: 'sales', cast: 'float' },
  { name: 'orders', cast: 'int' },
  { name: 'unitsSold', cast: 'int' },
  {
    name: 'cpc',
    cast: 'float',
    dependencies: ['cost', 'clicks'],
    query: `CASE WHEN SUM("clicks") = 0 OR SUM("clicks") IS NULL then 0 else ROUND(SUM("cost") / SUM("clicks"), 2) END`,
  },
  {
    name: 'profit',
    cast: 'float',
    dependencies: ['sales', 'cost'],
    query: `CASE WHEN SUM("cost") IS NULL AND SUM("sales") IS NULL THEN 0 WHEN SUM("cost") IS NULL AND SUM("sales") IS NOT NULL THEN ROUND(SUM("sales") - 0, 2) WHEN SUM("cost") IS NOT NULL AND SUM("sales") IS NULL THEN ROUND(0 - SUM("cost"), 2) WHEN SUM("cost") IS NOT NULL AND SUM("sales") IS NOT NULL THEN ROUND(SUM("sales") - SUM("cost"), 2) else 0 END`,
  },
  {
    name: 'ctr',
    cast: 'float',
    dependencies: ['impressions', 'clicks'],
    query: `CASE WHEN SUM("impressions") = 0 OR SUM("impressions") IS NULL then 0 else ROUND((SUM(CAST("clicks" as decimal)) / SUM("impressions")), 4) END`,
  },
  {
    name: 'cr',
    cast: 'float',
    dependencies: ['orders', 'clicks'],
    query: `CASE WHEN SUM("clicks") = 0 OR SUM("clicks") IS NULL then 0 else ROUND((SUM(CAST("orders" as decimal)) / SUM("clicks")), 4) END`,
  },
  {
    name: 'acos',
    cast: 'float',
    dependencies: ['sales', 'cost'],
    query: `CASE WHEN SUM("sales") = 0 OR SUM("sales") IS NULL THEN 0 else ROUND((SUM("cost") / SUM("sales")), 4) END`,
  },
  {
    name: 'aov',
    cast: 'float',
    dependencies: ['sales', 'orders'],
    query: `CASE WHEN SUM("orders") = 0 OR SUM("orders") IS NULL then 0 else ROUND(SUM("sales") / SUM("orders"), 2) END`,
  },
  {
    name: 'cpm',
    cast: 'float',
    query: `CASE WHEN SUM("impressions") = 0 OR SUM("impressions") IS NULL then 0 else ROUND((SUM("cost") * 1000) / SUM("impressions"), 2) END`,
  },
  {
    name: 'cpcon',
    cast: 'float',
    query: `CASE WHEN SUM("orders") = 0 OR SUM("orders") IS NULL then 0 else ROUND(SUM("cost") / SUM("orders"), 2) END`,
  },
  {
    name: 'roas',
    cast: 'float',
    dependencies: ['sales', 'cost'],
    query: `CASE WHEN SUM("cost") = 0 OR SUM("cost") IS NULL then 0 else ROUND(SUM("sales") / SUM("cost"), 2) END`,
  },
  {
    name: 'ipc',
    cast: 'float',
    dependencies: ['impressions', 'cost'],
    query: `CASE WHEN SUM("cost") = 0 OR SUM("cost") IS NULL then 0 else ROUND((SUM("impressions")) / SUM("cost"), 2) END`,
  },
  {
    name: 'unitsPerOrder',
    cast: 'float',
    dependencies: ['unitsSold', 'orders'],
    query: `CASE WHEN SUM("orders") = 0 OR SUM("orders") IS NULL then 0 else ROUND((SUM("unitsSold")) / SUM("orders"), 0) END`,
  },
  {
    name: 'costPerConvertedUnit',
    cast: 'float',
    dependencies: ['unitsSold', 'cost'],
    query: `CASE WHEN SUM("unitsSold") = 0 OR SUM("unitsSold") IS NULL then 0 else ROUND((SUM("cost")) / SUM("unitsSold"), 2) END`,
  },
  {
    name: 'impressionsPerClick',
    cast: 'float',
    dependencies: ['impressions', 'clicks'],
    query: `CASE WHEN SUM("clicks") = 0 OR SUM("clicks") IS NULL then 0 else ROUND((SUM("impressions")) / SUM("clicks"), 2) END`,
  },
  {
    name: 'clicksPerOrder',
    cast: 'float',
    dependencies: ['clicks', 'orders'],
    query: `CASE WHEN SUM("orders") = 0 OR SUM("orders") IS NULL then 0 else ROUND((SUM("clicks")) / SUM("orders"), 2) END`,
  },
  {
    name: 'impressionsPerSpend',
    cast: 'float',
    dependencies: ['impressions', 'cost'],
    query: `CASE WHEN SUM("cost") = 0 OR SUM("cost") IS NULL then 0 else ROUND((SUM("impressions")) / SUM("cost"), 2) END`,
  },
  {
    name: 'ordersPerUnit',
    cast: 'float',
    dependencies: ['unitsSold', 'orders'],
    query: `CASE WHEN SUM("unitsSold") = 0 OR SUM("unitsSold") IS NULL then 0 else ROUND((SUM("orders")) / SUM("unitsSold"), 0) END`,
  },
];

/**
 * Get metric names.
 *
 * @returns {array} metricNames
 */
const getMetricNames = () => {
  return metrics.map((metric) => metric.name);
};

/**
 * Get metric by name.
 *
 * @param {string} name
 * @returns {object} metric
 */
const getMetricByName = (name) => {
  const metric = metrics.find((m) => m.name === name);

  if (!metric) throw new Error('Advertising metric not found.');

  return metric;
};

/**
 * Get Metric dependencies.
 *
 * @param {object} metric
 * @param {boolean} includeSelf
 * @returns {array} dependencies
 */
const getMetricDependencies = (metric, includeSelf = false) => {
  let dependencies = 'dependencies' in metric ? metric.dependencies : [];

  return includeSelf ? [...dependencies, metric.name] : dependencies;
};

const getMetricQueryByName = (name, fromRecordsTable = false) => {
  const metric = getMetricByName(name);

  return getMetricQuery(metric, fromRecordsTable);
};

/**
 * Get Metric Query
 *
 * @param {object} metric
 * @param {boolean} fromRecordsTable
 * @returns {string} query
 */
const getMetricQuery = (metric, fromRecordsTable = false) => {
  let query =
    'query' in metric
      ? metric.query
      : `CASE WHEN SUM("${metric.name}") IS NULL THEN 0 else SUM("${metric.name}") END`;

  if (fromRecordsTable) {
    const dependencies = getMetricDependencies(metric, true);

    dependencies.forEach((dependency) => {
      query = query.split(`"${dependency}"`).join(`records."${dependency}"`);
    });
  }
  return query;
};

module.exports = {
  metrics,
  getMetricQuery,
  getMetricNames,
  getMetricByName,
  getMetricDependencies,
  getMetricQueryByName,
};
