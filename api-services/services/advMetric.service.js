const { AdvMetric } = require('../models');

const getAllAdvMetrics = async () => {
  const advMetrics = await AdvMetric.findAll();

  return advMetrics;
};

const getMetricsForStatiscics = async () => {
  const advMetrics = await AdvMetric.scope('mainStatistics').findAll();

  return advMetrics;
};

/**
 * Get static advertising metrics.
 *
 * @returns [<string>]
 */
const getStaticAdvMetrics = () => {
  return [
    'impressions',
    'clicks',
    'cost',
    'attributedConversions1d',
    'attributedConversions7d',
    'attributedConversions14d',
    'attributedConversions30d',
    'attributedConversions1dSameSKU',
    'attributedConversions7dSameSKU',
    'attributedConversions14dSameSKU',
    'attributedConversions30dSameSKU',
    'attributedUnitsOrdered1d',
    'attributedUnitsOrdered7d',
    'attributedUnitsOrdered14d',
    'attributedUnitsOrdered30d',
    'attributedSales1d',
    'attributedSales7d',
    'attributedSales14d',
    'attributedSales30d',
    'attributedSales1dSameSKU',
    'attributedSales7dSameSKU',
    'attributedSales14dSameSKU',
    'attributedSales30dSameSKU',
    'attributedUnitsOrdered1dSameSKU',
    'attributedUnitsOrdered7dSameSKU',
    'attributedUnitsOrdered14dSameSKU',
    'attributedUnitsOrdered30dSameSKU',
    'attributedDPV14d',
    'attributedUnitsSold14d',
    'attributedDetailPageViewsClicks14d',
    'attributedOrdersNewToBrand14d',
    'attributedOrdersNewToBrandPercentage14d',
    'attributedOrderRateNewToBrand14d',
    'attributedSalesNewToBrand14d',
    'attributedSalesNewToBrandPercentage14d',
    'attributedUnitsOrderedNewToBrand14d',
    'attributedUnitsOrderedNewToBrandPercentage14d',
    'unitsSold14d',
    'dpv14d',
    'acos',
    'cpc',
    'ctr',
    'cr',
    'profit',
  ];
};

module.exports = {
  getAllAdvMetrics,
  getStaticAdvMetrics,
  getMetricsForStatiscics,
};
