const { keys, pick, isArray } = require('lodash');
const moment = require('moment');
const { cast, literal, Op, where, col } = require('sequelize');

const BaseRepository = require('../base/base.repository');

const { AdvMetric } = require('@models');

const {
  metrics,
  getMetricByName,
  getMetricQuery,
  getMetricQueryByName,
} = require('./utils/metrics');
const { OPERATORS } = require('@utils/constants');

class AdvertisingRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  /**
   * Check if sorts has records dependency.
   *
   * @param {array} sorts
   * @returns {boolean}
   */
  sortHasRecordDependency(sorts) {
    return sorts.some((sort) => metrics.some((m) => m.name === sort[0]));
  }

  /**
   * Check if attributes has records dependency.
   *
   * @param {array} sorts
   * @returns {boolean}
   */
  attributesHasRecordDependency(attributes) {
    return attributes.some((attr) => metrics.some((m) => m.name === attr));
  }

  /**
   * Format attributes.
   *
   * @param {array} attributes
   * @returns {array} attributes
   */
  formatAttributes(attributes, useRecordsTable = false) {
    return attributes.map((attribute) => {
      const isMetric = metrics.some((m) => m.name === attribute);

      if (isMetric) {
        const metric = getMetricByName(attribute);

        return [
          cast(literal(getMetricQuery(metric, useRecordsTable)), metric.cast),
          attribute,
        ];
      }
      return attribute;
    });
  }

  getMetricRankingAttributes(attributes) {
    return attributes
      .filter((attribute) => metrics.some((m) => m.name === attribute))
      .map((attribute) => {
        const metric = getMetricByName(attribute);
        let query = `${getMetricQuery(metric, true)}`;

        return [
          cast(literal(`(RANK() OVER (ORDER BY ${query} DESC))`), 'int'),
          `${attribute}Ranking`,
        ];
      });
  }

  /**
   * Format sorts.
   *
   * @param {array} sorts
   * @returns {array} sorts
   */
  formatSort(sorts, useRecordsTable = false) {
    return sorts.map((sort) => {
      let [attribute, order] = sort;
      const isMetric = metrics.some((m) => m.name === attribute);

      if (isMetric)
        attribute = literal(getMetricQueryByName(attribute, useRecordsTable));

      return [attribute, order];
    });
  }

  /**
   * Format filters.
   *
   * @param {object} filters
   * @returns {object} formattedFilters
   */
  convertFiltersToArray(filters) {
    let filterCollection = [];

    keys(filters)
      .filter((key) => {
        const operator = OPERATORS.find((op) => key.includes(op.key));

        if (!operator) return true;

        const baseKey = key.replace(operator.key, '');
        const item = { operator: operator.value, value: filters[key] };

        const index = filterCollection.findIndex(({ key }) => key === baseKey);
        index > -1
          ? filterCollection[index].value.push(item)
          : filterCollection.push({ key: baseKey, value: [item] });

        return false;
      })
      .forEach((key) => {
        filterCollection.push({ key, value: filters[key] });
      });

    return filterCollection;
  }

  getFilterItemQueryValue(value, useRecordsTable = false) {
    const valueGenerator = (val) => {
      return metrics.some((m) => m.name === val)
        ? literal(getMetricQueryByName(val, useRecordsTable))
        : val;
    };

    if (Array.isArray(value)) {
      let newValues = {};

      value.forEach((val) => {
        newValues[Op[val.operator]] = valueGenerator(val.value);
      });

      return newValues;
    }

    return valueGenerator(value);
  }

  /**
   * Get filter where conditions.
   *
   * @param {array} filterArray
   * @param {boolean} useRecordsTable
   * @returns {object} whereCondition
   */
  getFilterWhereCondition(filterArray, useRecordsTable = false) {
    let whereCondition = {};

    filterArray
      .filter(({ key, value }) => {
        return !!!(
          metrics.some((metric) => metric.name === key) ||
          (!Array.isArray(value) &&
            metrics.some((metric) => metric.name === value)) ||
          (Array.isArray(value) &&
            value.some((val) =>
              metrics.some((metric) => metric.name === val.value)
            ))
        );
      })
      .forEach(({ key, value }) => {
        whereCondition[key] = this.getFilterItemQueryValue(
          value,
          useRecordsTable
        );
      });

    return whereCondition;
  }

  /**
   * Get filter having conditions.
   *
   * @param {array} filterArray
   * @param {boolean} useRecordsTable
   * @returns {array} havingCondition
   */
  getFilterHavingCondition(filterArray, useRecordsTable = false) {
    let havingCondition = [];

    filterArray
      .filter(({ key, value }) => {
        return (
          metrics.some((metric) => metric.name === key) ||
          (!Array.isArray(value) &&
            metrics.some((metric) => metric.name === value)) ||
          (Array.isArray(value) &&
            value.some((val) =>
              metrics.some((metric) => metric.name === val.value)
            ))
        );
      })
      .forEach(({ key, value }) => {
        havingCondition.push(
          where(
            metrics.some((m) => m.name === key)
              ? literal(getMetricQueryByName(key, useRecordsTable))
              : col(key),
            this.getFilterItemQueryValue(value, useRecordsTable)
          )
        );
      });

    return havingCondition;
  }

  /**
   * Get filter conditions.
   *
   * @param {object} filters
   * @param {boolean} useRecordsTable
   * @returns {object}
   */
  getFilterConditions(filters, useRecordsTable = false) {
    let filterArray = this.convertFiltersToArray(filters);

    const where = this.getFilterWhereCondition(filterArray);

    const having = this.getFilterHavingCondition(filterArray, useRecordsTable);

    return { where, having };
  }

  dateRangeToQuery(dateRange) {
    if (!dateRange) return {};

    return {
      [Op.gte]: dateRange.startDate,
      [Op.lte]: dateRange.endDate,
    };
  }

  /**
   * Convert metric to query statement.
   *
   * @param {AdvMetric} metric
   * @param {string} campaignType
   * @param {boolean} useCast
   * @param {boolean} useRecordsTable
   * @returns query
   */
  metricToQueryStatement(metric, useCast = true, useRecordsTable = true) {
    let { query } = metric;

    if (!useRecordsTable) query = query.split('records.').join('');

    return useCast
      ? [cast(literal(query), metric.cast), metric.name]
      : literal(query);
  }

  /**
   * Convert attributes to query statment.
   *
   * @param {string} campaignType
   * @param {array} attributes
   * @param {boolean} useRecordsTable
   * @returns statements
   */
  async attributesToQueryStatement(attributes, useRecordsTable = true) {
    const metrics = await AdvMetric.findAll();

    return attributes.map((attribute) => {
      const metric = metrics.find(({ name }) => name === attribute);

      return metric
        ? this.metricToQueryStatement(metric, true, useRecordsTable)
        : attribute;
    });
  }

  getPreviousDateRange = ({ startDate, endDate }) => {
    const startDateRef = moment(startDate).utc();
    const endDateRef = moment(endDate).utc();
    const diff = moment.duration(endDateRef.diff(startDateRef));

    return {
      startDate: startDateRef
        .subtract(diff.asDays(), 'days')
        .startOf('D')
        .format(),
      endDate: moment(startDate).subtract(1, 'd').utc().endOf('D').format(),
    };
  };

  getPreviousDataOptions(options, ids, dateRange, key) {
    options.group = [options.group[0]];
    options.where = {
      [key]: { [Op.in]: ids },
    };

    // Change records dateRange
    const previousDateRange = this.getPreviousDateRange(dateRange);
    options.include = options.include.filter((inc) => inc.as === 'records');

    options.include[0].where.date = {
      [Op.gte]: previousDateRange.startDate,
      [Op.lte]: previousDateRange.endDate,
    };

    // Update Attributes
    options.attributes = [
      key,
      ...options.attributes.filter((attribute) => isArray(attribute)),
    ];

    return pick(options, [
      'where',
      'group',
      'include',
      'distinct',
      'subQuery',
      'attributes',
    ]);
  }
}

module.exports = AdvertisingRepository;
