const Response = require('@utils/response');
const TargetingRepository = require('./targeting.repository');
const TargetingRecordRepository = require('./targetingRecord.repository');
const { paginate } = require('@services/pagination.service');

const {
  getPreviousDateRange,
  getPreviousDateRangeWithFormat,
  getPreviousMonthDateRange,
} = require('../utils/dateRange');

/**
 * List targets by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listTargetingsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;
  const { rows, count } = await TargetingRepository.findAndCountAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Targetings successfully fetched.');
};

const getConvertersSummary = async (profile, options) => {
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
      count:
        await TargetingRepository.countWithConvertersByProfileIdAndDateRange(
          advProfileId,
          dateRange
        ),
      ...(await TargetingRepository.getMetricsFromConvertersByProfileIdAndDateRange(
        advProfileId,
        dateRange,
        metrics
      )),
    },
    {
      key: 'nonConverters',
      count:
        await TargetingRepository.countWithOutConvertersByProfileIdAndDateRange(
          advProfileId,
          dateRange
        ),
      ...(await TargetingRepository.getMetricsFromNonConvertersByProfileIdAndDateRange(
        advProfileId,
        dateRange,
        metrics
      )),
    },
    {
      key: 'all',
      count:
        await TargetingRepository.countWithImpressionsByProfileIdAndDateRange(
          advProfileId,
          dateRange
        ),
      ...(await TargetingRepository.getMetricsFromWithImpressionsByProfileIdAndDateRange(
        advProfileId,
        dateRange,
        metrics
      )),
    },
  ];

  return new Response()
    .withData(data)
    .withMessage('Conversion Summary successfully fetched.');
};

const getTargetingsDistributionByProfile = async (profile, options) => {
  const { attribute, dateRange } = options;
  let maxValue = 0;
  let data = [];

  const maxRecord = await TargetingRecordRepository.findMaxByProfileId(
    profile.advProfileId,
    { ...options, sort: [[attribute, 'desc']] }
  );

  if (maxRecord) {
    maxValue = maxRecord.toJSON()[attribute];

    const diff = Math.round((maxValue / 8 + Number.EPSILON) * 10000) / 10000;

    data = [{ start: 0, end: diff }];

    for (let index = 1; index < 8; index++) {
      data[index] = {
        start: data[index - 1].end,
        end:
          index === 31
            ? maxValue
            : Math.round(
                (data[index - 1].end + diff + Number.EPSILON) * 10000
              ) / 10000,
      };
    }

    data = await Promise.all(
      data.map(async (d, i) => {
        const startKey = i
          ? `${attribute}GreaterThan`
          : `${attribute}GreaterThanOrEqualTo`;

        const count = await TargetingRepository.countWithSumMetrics(
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

module.exports = {
  getConvertersSummary,
  listTargetingsByProfile,
  getTargetingsDistributionByProfile,
};
