const { pick, keys } = require('lodash');
const { InboundFBAShipment, InboundFBAShipmentItem } = require('../models');

/**
 * Get inbound fba shipments by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getInBoundFbaShipmentsByAccountId = async (accountId, query) => {
  const { filter, pageSize, pageOffset, sort, include } = query;

  const options = {
    where: {
      accountId,
      ...pick(filter, keys(InboundFBAShipment.rawAttributes)),
    },
    limit: pageSize,
    offset: pageOffset,
    order: sort,
  };

  if (filter.sellerSku || include) {
    options.include = {
      model: InboundFBAShipmentItem,
      as: 'items',
      attributes:
        include === 'items'
          ? { exclude: ['inboundFBAShipmentItemId', 'createdAt', 'updatedAt'] }
          : [],
      required: true,
      where: {
        ...pick(filter, keys(InboundFBAShipmentItem.rawAttributes)),
      },
    };
  }

  const shipments = await InboundFBAShipment.findAndCountAll(options);

  return shipments;
};

/**
 * Get inbound fba shipments by accountId and inboundFBAShipmentId
 *
 * @param uuid accountId
 * @param string inboundFBAShipmentId
 * @param object query
 * @returns InboundFBAShipment
 */
const getInBoundFbaShipmentByAccountIdAndId = async (
  accountId,
  inboundFBAShipmentId,
  query
) => {
  const { include } = query;

  const options = {
    where: {
      accountId,
      inboundFBAShipmentId,
    },
  };

  if (include === 'items') {
    options.include = {
      model: InboundFBAShipmentItem,
      as: 'items',
      attributes: {
        exclude: ['inboundFBAShipmentItemId', 'createdAt', 'updatedAt'],
      },
      required: true,
    };
  }

  const shipment = await InboundFBAShipment.findOne(options);

  return shipment;
};

module.exports = {
  getInBoundFbaShipmentsByAccountId,
  getInBoundFbaShipmentByAccountIdAndId,
};
