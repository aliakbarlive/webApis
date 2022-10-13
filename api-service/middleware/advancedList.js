const dot = require('dot-object');
const moment = require('moment');
const { Op } = require('sequelize');
const { upperFirst, isString } = require('lodash');

const Models = require('../models');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

const {
  OPERATORS,
  LIST_DEFAULT_QUERY,
  DATE_RANGE_QUERY,
} = require('../utils/constants');

// Pagination
exports.paginate = asyncHandler(async (req, res, next) => {
  req.query.page = parseInt(req.query.page) || 1;
  req.query.pageSize = parseInt(req.query.pageSize) || 10;
  req.query.pageOffset = (req.query.page - 1) * req.query.pageSize;
  next();
});

// Sorting
exports.sortable = asyncHandler(async (req, res, next) => {
  const { sort = {} } = req.query;

  req.query.sort = Object.keys(sort)
    .map((key) => [key, sort[key]])
    .map((sort) => {
      const [field, order] = sort;
      return [...field.split('.'), order];
    });

  next();
});

// Identifiable
exports.identifiable = asyncHandler(async (req, res, next) => {
  const paramsKey = Object.keys(req.params).filter((key) => key.includes('Id'));

  await Promise.all(
    paramsKey.map(async (paramKey) => {
      const identifierName = paramKey.slice(0, -2);
      const modelName = upperFirst(identifierName);

      if (Models[modelName]) {
        const identifierValue = await Models[modelName].findByPk(
          req.params[paramKey]
        );

        if (!identifierValue) {
          return next(new ErrorResponse(`No ${modelName} Found`, 404));
        }

        req.params[identifierName] = identifierValue;
      }
    })
  );

  next();
});

exports.withFilters = async (req, res, next) => {
  let filter = {};

  Object.keys(req.query)
    .filter((k) => ![...LIST_DEFAULT_QUERY, ...DATE_RANGE_QUERY].includes(k))
    .filter((key) => {
      const op = OPERATORS.find((op) => key.includes(op.key));
      if (!op) return true;

      const k = key.replace(op.key, '');
      filter[k] = { ...filter[k], [Op[op.value]]: req.query[key] };

      return false;
    })
    .forEach((key) => {
      const value = req.query[key];
      filter[key] =
        isString(value) && value.includes(',')
          ? { [Op.in]: value.split(',') }
          : value;
      delete req.query[key];
    });

  req.query.filter = dot.object(filter);

  next();
};

exports.withScope = async (req, res, next) => {
  req.query.scope = req.query.scope ? req.query.scope.split(',') : [];
  next();
};

exports.withSort = async (req, res, next) => {
  let { sort } = req.query;

  if (sort) {
    sort = sort.split(',').map((sortCondition) => {
      const [key, order] = sortCondition.split(':');
      return [...key.split('.'), order ?? 'desc'];
    });
  }

  req.query.sort = sort ?? [];
  next();
};

exports.withDateRange = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate && endDate) {
    req.query.dateRange = {
      startDate,
      endDate,
    };

    delete req.query.startDate;
    delete req.query.endDate;
  }

  next();
};
