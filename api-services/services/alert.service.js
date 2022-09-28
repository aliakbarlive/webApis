const { Op } = require('sequelize');
const moment = require('moment');
const { pick, keys, lowerFirst } = require('lodash');

const { Alert, Listing } = require('../models');
const Models = require('../models');

/**
 * Get Alerts by userId.
 * @param int userId
 * @param int accountId
 * @param string marketplaceId
 * @param object query
 * @returns Promise
 */
const getAlertsByUserId = async (userId, query) => {
  const { filter, sort, scope, dateRange, pageSize, pageOffset } = query;

  const alerts = await Alert.scope(scope).findAndCountAll({
    attributes: {
      exclude: ['userId', 'accountId', 'marketplaceId', 'data', 'updatedAt'],
    },
    where: {
      userId,
      createdAt: {
        [Op.gte]: dateRange.startDate,
        [Op.lte]: dateRange.endDate,
      },
      ...pick(filter, keys(Alert.rawAttributes)),
    },
    include: {
      model: Listing,
      as: 'listing',
      attributes: ['asin', 'thumbnail'],
      where: pick(filter.listing, keys(Listing.rawAttributes)),
    },
    offset: pageOffset,
    limit: pageSize,
    order: sort,
  });

  return alerts;
};

/**
 * Get alert by id.
 * @param int alertId
 * @param object query
 * @returns Promise
 */
const getAlertByIdAndUserId = async (alertId, userId, query) => {
  const alert = await Alert.findOne({
    where: {
      alertId,
      userId,
      ...pick(query, keys(Alert.rawAttributes)),
    },
  });

  return alert;
};

/**
 * Get alertable details.
 * @param Alert alert
 * @returns Promise
 */
const getAlertableDetails = async (alert) => {
  const { type, where, id = null } = alert.data.alertable;

  const Model = Models[type];
  const options = {};

  const alertable = id
    ? await Model.findByPk(id, options)
    : await Model.findOne({ where, ...options });

  alert.data[lowerFirst(type)] = alertable;

  return alert;
};

/**
 * Mark alert as resolved.
 * @param Alert alert
 * @returns Promise
 */
const markAlertAsResolved = async (alert) => {
  return await alert.update({ resolvedAt: moment().format() });
};

/**
 * Mark alert as unresolved.
 * @param Alert alert
 * @returns Promise
 */
const markAlertAsUnResolved = async (alert) => {
  return await alert.update({ resolvedAt: null });
};

module.exports = {
  getAlertsByUserId,
  getAlertableDetails,
  getAlertByIdAndUserId,
  markAlertAsResolved,
  markAlertAsUnResolved,
};
