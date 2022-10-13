const moment = require('moment');
const { keys, isObject, isNull, pick, isArray } = require('lodash');
const { where, or, cast, literal, Op, col } = require('sequelize');
const {
  getAllAdvMetrics,
  getMetricsForStatiscics,
} = require('./advMetric.service');

/**
 * Get sales attribute of specific campaign type.
 *
 * @param {string} campaignType
 * @returns <string>
 */
const getCampaignTypeSalesAttribute = (campaignType) => {
  return campaignType == 'sponsoredBrands'
    ? 'attributedSales14d'
    : 'attributedSales30d';
};

/**
 * Get conversions attribute of specific campaign type.
 *
 * @param {string} campaignType
 * @returns <string>
 */
const getCampaignTypeConversionsAttribute = (campaignType) => {
  return campaignType == 'sponsoredBrands'
    ? 'attributedConversions14d'
    : 'attributedConversions30d';
};

/**
 * Get conversions attribute of specific campaign type.
 *
 * @param {string} campaignType
 * @returns <string>
 */
const getCampaignTypeOrdersAttribute = (campaignType) => {
  return campaignType == 'sponsoredBrands'
    ? 'unitsSold14d'
    : 'attributedConversions30d';
};

/**
 * Convert advMetric to query function.
 *
 * @param {AdvMetric} advMetric
 * @param {string} campaignType
 * @param {boolean} useCast
 * @returns
 */
const advMetricToQueryFn = (
  advMetric,
  campaignType,
  useCast = true,
  useRecordsTable = true
) => {
  let query = advMetric.query
    .split('{salesAttribute}')
    .join(getCampaignTypeSalesAttribute(campaignType))
    .split('{conversionsAttribute}')
    .join(getCampaignTypeConversionsAttribute(campaignType))
    .split('{ordersAttribute}')
    .join(getCampaignTypeOrdersAttribute(campaignType));

  if (!useRecordsTable) {
    query = query.split('records.').join('');
  }

  return useCast
    ? [cast(literal(query), advMetric.cast), advMetric.name]
    : literal(query);
};

const dateRangeQueryFn = (dateRange) => {
  return {
    date: {
      [Op.gte]: dateRange.startDate,
      [Op.lte]: dateRange.endDate,
    },
  };
};

const filterWithBidUpdatedAtInDays = (value) => {
  const now = moment().utc().format();
  if (isObject(value)) {
    const [symbol] = Reflect.ownKeys(value);
    if (Symbol.keyFor(symbol) === 'gt' || Symbol.keyFor(symbol) === 'gte') {
      value = { [Op.or]: [{ [Op.is]: null }, value] };
    }
  }

  return where(
    literal(
      `CASE WHEN "bidUpdatedAt" IS NULL THEN NULL ELSE DATE_PART('day', '${now}' - "bidUpdatedAt") END`
    ),
    value
  );
};

const transformListQueryFilter = (filter, metrics, campaignType) => {
  let having = [];

  keys(filter).forEach((attribute) => {
    let fValue = filter[attribute];
    let hAttribute = null;
    let hLogic = null;

    let mFilterValue = null;
    const mFilterAttribute = metrics.find((am) => am.name === attribute);
    if (mFilterAttribute)
      hAttribute = advMetricToQueryFn(mFilterAttribute, campaignType, false);

    if (isObject(fValue)) {
      let newValue = {};
      Reflect.ownKeys(fValue).forEach((symbol) => {
        mFilterValue = metrics.find((am) => am.name === fValue[symbol]);

        newValue[symbol] = mFilterValue
          ? advMetricToQueryFn(mFilterValue, campaignType, false)
          : fValue[symbol];
      });

      hLogic = newValue;
      hAttribute = mFilterValue ? col(attribute) : hAttribute;
    } else {
      mFilterValue = metrics.find((am) => am.name === fValue);
      if (mFilterValue) delete filter[attribute];

      hAttribute = mFilterValue ? col(attribute) : hAttribute;
      hLogic = mFilterValue
        ? advMetricToQueryFn(mFilterValue, campaignType, false)
        : fValue;
    }

    if (!isNull(hAttribute) && !isNull(hLogic)) {
      having.push(where(hAttribute, hLogic));
      delete filter[attribute];
    }
  });

  return { filter, having };
};

/**
 * Transform list request query.
 *
 * @param {object} query
 * @returns
 */
const transformAdvertisingListQuery = async (query) => {
  const { campaignType } = query.filter;
  let { dateRange, attributes, sort } = query;

  const advMetrics = await getAllAdvMetrics();

  // Format attributes.
  if (attributes) {
    attributes = attributes.split(',').map((attribute) => {
      const metric = advMetrics.find((a) => a.name === attribute);

      return metric ? advMetricToQueryFn(metric, campaignType) : attribute;
    });
  }

  // Format sort.
  sort = sort.map((order) => {
    let [sortAttribute] = order;
    const metric = advMetrics.find((a) => a.name === sortAttribute);

    order[0] = metric
      ? advMetricToQueryFn(metric, campaignType, false)
      : sortAttribute;

    return order;
  });

  let { filter, having } = transformListQueryFilter(
    query.filter,
    advMetrics,
    campaignType
  );

  if ('conditions' in filter) {
    let conditionHavings = [];

    filter.conditions.forEach((condition) => {
      let conditionQuery = transformListQueryFilter(
        condition,
        advMetrics,
        campaignType
      );

      if (keys(conditionQuery.filter).length) {
        keys(conditionQuery.filter).forEach((conditionFilterAttribute) => {
          if (isObject(conditionQuery.filter[conditionFilterAttribute])) {
            const [sym] = Reflect.ownKeys(
              conditionQuery.filter[conditionFilterAttribute]
            );

            if (Symbol.keyFor(sym) === 'and') {
              conditionQuery.filter[conditionFilterAttribute][sym] =
                conditionQuery.filter[conditionFilterAttribute][sym].map(
                  (andLogicItem) => {
                    const [andLogicItemSym] = Reflect.ownKeys(andLogicItem);

                    const andLogicItemMetricValue = advMetrics.find(
                      (am) => am.name === andLogicItem[andLogicItemSym]
                    );

                    if (andLogicItemMetricValue) {
                      andLogicItem[andLogicItemSym] = advMetricToQueryFn(
                        andLogicItemMetricValue,
                        campaignType,
                        false
                      );
                    }
                    return andLogicItem;
                  }
                );
            }
          }

          conditionQuery.having.push(
            conditionFilterAttribute === 'bidUpdatedAtInDays'
              ? filterWithBidUpdatedAtInDays(
                  conditionQuery.filter[conditionFilterAttribute]
                )
              : where(
                  col(conditionFilterAttribute),
                  conditionQuery.filter[conditionFilterAttribute]
                )
          );
        });
      }

      if (conditionQuery.having.length)
        conditionHavings.push(conditionQuery.having);
    });

    if (conditionHavings.length) {
      having = or(...having, ...conditionHavings);
    }
  }

  dateRange = dateRangeQueryFn(dateRange);

  return { attributes, sort, having, dateRange, filter };
};

/**
 * Transform advertising records query.
 *
 * @param {object} query
 * @returns
 */
const transformAdvertisingRecordsQuery = async (query) => {
  let { filter, dateRange, attributes } = query;

  const advMetrics = await getAllAdvMetrics();

  // Format attributes.
  attributes = attributes.split(',').map((attribute) => {
    const metric = advMetrics.find((a) => a.name === attribute);

    return advMetricToQueryFn(metric, filter.campaignType, true, false);
  });

  dateRange = dateRangeQueryFn(dateRange);

  return { attributes, filter, dateRange };
};

const transformAdvertisingStatisticsQuery = async (query) => {
  let { filter, dateRange, attributes } = query;

  const metrics = await getMetricsForStatiscics();

  attributes = metrics.map((metric) =>
    advMetricToQueryFn(metric, filter.campaignType, true, false)
  );

  dateRange = dateRangeQueryFn(dateRange);

  return { attributes, filter, dateRange };
};

const generatePrevDateRange = ({ startDate, endDate }) => {
  const startDateRef = moment(startDate).utc();
  const endDateRef = moment(endDate).utc();
  const diff = moment.duration(endDateRef.diff(startDateRef));

  return {
    startDate: startDateRef
      .subtract(diff.asDays() - 1, 'days')
      .startOf('D')
      .format(),
    endDate: startDateRef.endOf('D').format(),
  };
};

const generatePrevOptions = (options, rows, dateRange, key) => {
  options.group = [options.group[0]];

  // Use id of the row
  options.where = {
    [key]: {
      [Op.in]: rows.map((row) => row[key]),
    },
  };

  // Change records dateRange
  options.include = options.include.filter((inc) => inc.as === 'records');

  options.include[0].where.date = {
    [Op.gte]: dateRange.startDate,
    [Op.lte]: dateRange.endDate,
  };

  // Update Attributes
  options.attributes = [key, ...options.attributes.filter((a) => isArray(a))];

  return pick(options, [
    'where',
    'group',
    'include',
    'distinct',
    'subQuery',
    'attributes',
  ]);
};

module.exports = {
  filterWithBidUpdatedAtInDays,
  getCampaignTypeSalesAttribute,
  getCampaignTypeConversionsAttribute,
  transformAdvertisingListQuery,
  transformAdvertisingRecordsQuery,
  transformAdvertisingStatisticsQuery,
  generatePrevOptions,
  generatePrevDateRange,
};
