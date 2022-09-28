const moment = require('moment');
const { pick, keys, reverse, range } = require('lodash');
const { paginate } = require('@services/pagination.service');

const { CampaignRecordRepository, CampaignRepository } = require('../campaign');
const { KeywordRepository, KeywordRecordRepository } = require('../keyword');
const { TargetRecordRepository } = require('../target');
const { ProductAdRepository } = require('../productAd');

const Response = require('@utils/response');
const {
  getPreviousDateRange,
  getPreviousDateRangeWithFormat,
  getPreviousMonthDateRange,
} = require('../utils/dateRange');

const getKeywordsDistributionByProfile = async (profile, options) => {
  const { attribute, dateRange } = options;
  let maxValue = 0;
  let data = [];

  const maxRecord = await KeywordRecordRepository.findMaxByProfileId(
    profile.advProfileId,
    { ...options, sort: [[attribute, 'desc']] }
  );

  if (maxRecord) {
    maxValue = maxRecord.toJSON()[attribute];

    const getDecimalLength = (num) => {
      if (Number.isInteger(num)) {
        return 0;
      }

      const decimalStr = num.toString().split('.')[1];
      return decimalStr.length;
    };

    const exp = getDecimalLength(maxValue);
    const multiplier = Math.pow(10, exp);

    maxValue = maxValue * multiplier;
    maxValue = maxValue + (6 - (maxValue % 6));
    maxValue = maxValue / multiplier;
    const diff = (maxValue * multiplier) / (6 * multiplier);

    data = [{ start: 0, end: diff }];

    for (let index = 1; index < 6; index++) {
      data[index] = {
        start: data[index - 1].end,
        end: Math.round((data[index - 1].end + diff) * multiplier) / multiplier,
      };
    }

    data = await Promise.all(
      data.map(async (d, i) => {
        const startKey = i
          ? `${attribute}GreaterThan`
          : `${attribute}GreaterThanOrEqualTo`;

        const count = await KeywordRepository.countWithSumMetrics(
          profile.advProfileId,
          dateRange,
          {
            [startKey]: d.start,
            [`${attribute}LessThanOrEqualTo`]: d.end,
          }
        );

        return { ...d, count };
      })
    );
  }

  return new Response()
    .withData(data)
    .withMessage('Profile distribution successfully fetched.');
};

/**
 * Get profile funnel.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getProfileFunnel = async (profile, options) => {
  const data = await CampaignRecordRepository.getSummaryByProfileId(
    profile.advProfileId,
    { ...options, attributes: ['impressions', 'clicks', 'ctr', 'cr', 'orders'] }
  );

  return new Response()
    .withData(data ?? { impressions: 0, clicks: 0, ctr: 0, cr: 0, orders: 0 })
    .withMessage('Profile funnel successfully fetched.');
};

const getPerformanceByGranularity = async (
  account,
  profile,
  granularity,
  options
) => {
  const { dateRange, ...filter } = options;
  const spApiClient = await account.spApiClient('na');

  const fStartDate = moment(dateRange.startDate).utc().startOf('D').format();
  const fEndDate = moment(dateRange.endDate).utc().endOf('D').format();
  const i = `${fStartDate}--${fEndDate}`;

  const response = await spApiClient.callAPI({
    endpoint: 'sales',
    operation: 'getOrderMetrics',
    query: {
      marketplaceIds: profile.marketplaceId,
      interval: i,
      granularity: granularity,
      granularityTimeZone: profile.timezone,
    },
  });

  const attributes = [
    'sales',
    'cost',
    'acos',
    'cr',
    'cpc',
    'impressions',
    'ctr',
    'clicks',
    'roas',
    'orders',
  ];

  const records = await Promise.all(
    response.map(async (r) => {
      let [startDate, endDate] = r.interval.split('--');
      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).subtract(1, 'd').format('YYYY-MM-DD');

      let data = {
        startDate,
        endDate,
        date: `${startDate} - ${endDate}`,
        totalSales: r.totalSales.amount,
      };

      const cRecords = await CampaignRecordRepository.getSummaryByProfileId(
        profile.advProfileId,
        { dateRange: { startDate, endDate }, attributes, raw: true, filter }
      );

      if (!cRecords) {
        attributes.forEach((attr) => (data[attr] = 0));
      } else {
        attributes.forEach((attr) => (data[attr] = cRecords[attr]));
      }

      data.tacos =
        Math.round((data.cost / data.totalSales + Number.EPSILON) * 10000) /
          10000 || 0;

      return data;
    })
  );

  return new Response()
    .withData(reverse(records))
    .withMessage('Profile overall performance successfully fetched');
};

/**
 * Get profile performance.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getPerformanceByAccountAndProfile = async (account, profile, options) => {
  const {
    dateRange: currentDateRange,
    getDiffInMonth = false,
    ...filter
  } = options;

  let performance = {};
  const attributes = [
    'sales',
    'cost',
    'acos',
    'cpcon',
    'cr',
    'cpc',
    'impressions',
    'ctr',
    'clicks',
    'roas',
    'orders',
    'cpm',
    'aov',
    'impressionsPerClick',
    'clicksPerOrder',
    'ordersPerUnit',
    'unitsSold',
  ];

  let records = [
    { key: 'current', dateRange: currentDateRange },
    {
      key: 'previous',
      dateRange: getDiffInMonth
        ? getPreviousMonthDateRange(currentDateRange)
        : getPreviousDateRangeWithFormat(currentDateRange),
    },
  ];

  const spApiClient = await account.spApiClient('na');

  await Promise.all(
    records.map(async (record) => {
      let data = await CampaignRecordRepository.getSummaryByProfileId(
        profile.advProfileId,
        { dateRange: record.dateRange, attributes, raw: true, filter }
      );

      if (!data) {
        data = {};
        attributes.forEach((attr) => (data[attr] = 0));
      }

      record.data = data;

      // Fetch total sales from spApi
      const { startDate, endDate } = record.dateRange;
      const fStartDate = moment(startDate).utc().startOf('D').format();
      const fEndDate = moment(endDate).utc().endOf('D').format();
      const i = `${fStartDate}--${fEndDate}`;

      const response = await spApiClient.callAPI({
        endpoint: 'sales',
        operation: 'getOrderMetrics',
        query: {
          marketplaceIds: profile.marketplaceId,
          interval: i,
          granularity: 'Total',
          granularityTimeZone: 'US/Pacific',
        },
      });

      const { totalSales } = response[0];

      // Custom Calculations
      record.data.revenue = totalSales.amount;
      record.data.organicSales = record.data.revenue - record.data.sales;
      record.data.advertisingSalesPercentage =
        Math.round(
          (record.data.sales / record.data.revenue + Number.EPSILON) * 10000
        ) / 10000 || 0;
      record.data.organicSalesPercentage =
        Math.round(
          (record.data.organicSales / record.data.revenue + Number.EPSILON) *
            10000
        ) / 10000 || 0;
      record.data.tacos =
        Math.round(
          (record.data.cost / record.data.revenue + Number.EPSILON) * 10000
        ) / 10000 || 0;

      performance[record.key] = pick(record, ['dateRange', 'data']);
    })
  );

  return new Response()
    .withData(performance)
    .withMessage('Profile overall performance successfully fetched');
};

/**
 * Get performance by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 *
 * @returns {Promise<Response>} response
 */
const getPerformanceByProfile = async (profile, options) => {
  let performance = {};

  const { advProfileId } = profile;
  const { attributes, dateRange: currentDateRange, ...filter } = options;

  let records = [
    { key: 'current', dateRange: currentDateRange },
    { key: 'previous', dateRange: getPreviousDateRange(currentDateRange) },
  ];

  await Promise.all(
    records.map(async (record) => {
      let data = await CampaignRecordRepository.getSummaryByProfileId(
        advProfileId,
        {
          attributes,
          raw: true,
          filter,
          dateRange: record.dateRange,
        }
      );

      if (!data) {
        data = {};
        attributes.forEach((attr) => (data[attr] = 0));
      }

      record.data = data;

      performance[record.key] = pick(record, ['dateRange', 'data']);
    })
  );

  return new Response()
    .withData(performance)
    .withMessage('Profile performance successfully fetched');
};

const getCampaignTypesSummary = async (profile, options) => {
  const { dateRange } = options;

  let data = {
    total: { filter: {} },
    sp: { filter: { campaignType: 'sponsoredProducts' } },
    sb: { filter: { campaignType: 'sponsoredBrands' } },
    sd: { filter: { campaignType: 'sponsoredDisplay' } },
    auto: { filter: { targetingType: 'auto' } },
    manual: { filter: { targetingType: 'manual' } },
  };

  await Promise.all(
    keys(data).map(async (key) => {
      data[key]['count'] = await CampaignRepository.countActive({
        advProfileId: profile.advProfileId,
        ...data[key]['filter'],
      });

      const record = await CampaignRecordRepository.getSummaryByProfileId(
        profile.advProfileId,
        {
          attributes: ['sales'],
          filter: data[key]['filter'],
          dateRange,
        }
      );

      data[key]['sales'] = record ? record.sales : 0;
      data[key] = pick(data[key], ['count', 'sales']);
    })
  );

  return new Response()
    .withData(data)
    .withMessage('Performance Breakdown by campaign type successfully fetched');
};
/**
 * Get profile performance by campaign types.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getProfilePerformanceByCampaignTypes = async (profile, options) => {
  const { advProfileId } = profile;
  const { attributes } = options;

  let breakdowns = [
    {
      title: 'Sponsored Products',
      filter: {
        campaignType: 'sponsoredProducts',
      },
    },
    {
      title: 'Sponsored Brands',
      filter: {
        campaignType: 'sponsoredBrands',
        adFormat: 'productCollection',
      },
    },
    {
      title: 'Sponsored Brands Video',
      filter: {
        campaignType: 'sponsoredBrands',
        adFormat: 'video',
      },
    },
    {
      title: 'Sponsored Display',
      filter: {
        campaignType: 'sponsoredDisplay',
      },
    },
    {
      title: 'Total',
      filter: {},
    },
  ];

  breakdowns = await Promise.all(
    breakdowns.map(async (breakdown) => {
      let defaultData = {};
      attributes.forEach((attribute) => (defaultData[attribute] = 0));

      let data = await CampaignRecordRepository.getSummaryByProfileId(
        advProfileId,
        { ...options, filter: breakdown.filter }
      );

      data = data ? data.toJSON() : defaultData;

      return pick({ ...breakdown, ...data }, ['title', ...attributes]);
    })
  );

  return new Response()
    .withData(breakdowns)
    .withMessage('Performance Breakdown by campaign type successfully fetched');
};

/**
 * Get profile performance by targeting types.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getProfilePerformanceByTargetingTypes = async (profile, options) => {
  const { advProfileId } = profile;
  const { attributes } = options;

  let summary = {};
  let breakdowns = [
    { title: 'Manual Keywords', targetingType: 'manual' },
    { title: 'Automatic', targetingType: 'auto' },
    { title: 'Product Targeting (PT)', targetingType: 'asin' },
  ];

  summary.auto = await CampaignRecordRepository.getSummaryByProfileId(
    advProfileId,
    {
      ...options,
      filter: { targetingType: 'auto', campaignType: 'sponsoredProducts' },
    }
  );

  summary.manual = await KeywordRecordRepository.getSummaryByProfileId(
    advProfileId,
    options
  );

  summary.asin = await TargetRecordRepository.getSummaryByProfileId(
    advProfileId,
    options
  );

  let defaultData = {};
  attributes.forEach((attribute) => (defaultData[attribute] = 0));

  const keywordBreakdown = await Promise.all(
    ['exact', 'broad', 'phrase'].map(async (matchType) => {
      let data = await KeywordRecordRepository.getSummaryByProfileId(
        advProfileId,
        {
          ...options,
          matchType,
        }
      );

      return data
        ? { ...data.toJSON(), matchType }
        : { ...defaultData, matchType };
    })
  );

  breakdowns = await Promise.all(
    breakdowns.map(async (breakdown) => {
      data = summary[breakdown.targetingType]
        ? summary[breakdown.targetingType].toJSON()
        : defaultData;

      if (breakdown.targetingType === 'manual') {
        breakdown.subBreakdown = keywordBreakdown;
      }

      return pick({ ...breakdown, ...data }, [
        'title',
        'subBreakdown',
        ...attributes,
      ]);
    })
  );

  return new Response()
    .withData(breakdowns)
    .withMessage(
      'Performance Breakdown by targeting type successfully fetched'
    );
};

const getChangesByProfileAndCampaigns = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await CampaignRepository.findAndCountAllWithComparisonByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Changes by campaigns successfully fetched.');
};

const getChangesByProfileAndProducts = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await ProductAdRepository.findAndCountAllWithComparisonByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Changes by products successfully fetched.');
};

const getChangesByProfileAndKeywords = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await KeywordRepository.findAndCountAllWithComparisonByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Changes by keywords successfully fetched.');
};

const getKeywordConvertersSummary = async (profile, options) => {
  const { dateRange } = options;
  const { advProfileId } = profile;
  const metrics = [
    'cost',
    'sales',
    'impressions',
    'clicks',
    'orders',
    'unitsSold',
    'ctr',
    'cr',
    'acos',
    'cpc',
    'cpm',
    'cpcon',
  ];

  const data = [
    {
      key: 'converters',
      count: await KeywordRepository.countWithConvertersByProfileIdAndDateRange(
        advProfileId,
        dateRange
      ),
      ...(await KeywordRepository.getMetricsFromConvertersByProfileIdAndDateRange(
        advProfileId,
        dateRange,
        metrics
      )),
    },
    {
      key: 'nonConverters',
      count:
        await KeywordRepository.countWithOutConvertersByProfileIdAndDateRange(
          advProfileId,
          dateRange
        ),
      ...(await KeywordRepository.getMetricsFromNonConvertersByProfileIdAndDateRange(
        advProfileId,
        dateRange,
        metrics
      )),
    },
    {
      key: 'all',
      count:
        await KeywordRepository.countWithImpressionsByProfileIdAndDateRange(
          advProfileId,
          dateRange
        ),
      ...(await KeywordRepository.getMetricsFromWithImpressionsByProfileIdAndDateRange(
        advProfileId,
        dateRange,
        metrics
      )),
    },
  ];

  return new Response()
    .withData(data)
    .withMessage('Changes by keywords successfully fetched.');
};

const getSalesSummaryByProfile = async (profile, options) => {
  let totalSummary = await CampaignRecordRepository.getSummaryByProfileId(
    profile.advProfileId,
    {
      attributes: ['sales', 'unitsSold', 'cost', 'profit'],
      raw: true,
      dateRange: options.dateRange,
    }
  );

  const defaultData = {
    sales: 0,
    unitsSold: 0,
    cost: 0,
    profit: 0,
  };

  let perUnitSummary = { ...defaultData };
  totalSummary = totalSummary ?? defaultData;

  if (totalSummary.unitsSold) {
    perUnitSummary.unitsSold = 1;
    perUnitSummary.sales =
      Math.round(
        (totalSummary.sales / totalSummary.unitsSold + Number.EPSILON) * 100
      ) / 100;

    perUnitSummary.cost =
      Math.round(
        (totalSummary.cost / totalSummary.unitsSold + Number.EPSILON) * 100
      ) / 100;

    perUnitSummary.profit =
      Math.round(
        (totalSummary.profit / totalSummary.unitsSold + Number.EPSILON) * 100
      ) / 100;
  }

  return new Response()
    .withData({ totalSummary, perUnitSummary })
    .withMessage('Changes by keywords successfully fetched.');
};

module.exports = {
  getProfileFunnel,
  getCampaignTypesSummary,
  getPerformanceByProfile,
  getSalesSummaryByProfile,
  getPerformanceByGranularity,
  getKeywordConvertersSummary,
  getPerformanceByAccountAndProfile,
  getProfilePerformanceByCampaignTypes,
  getChangesByProfileAndKeywords,
  getProfilePerformanceByTargetingTypes,
  getChangesByProfileAndCampaigns,
  getChangesByProfileAndProducts,
  getKeywordsDistributionByProfile,
};
