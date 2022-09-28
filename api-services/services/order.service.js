const { literal, Op, fn } = require('sequelize');
const { pick, keys } = require('lodash');
const { Order, OrderItem, OrderAddress } = require('../models');

/**
 * Transform query to options.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const transformQueryToOptions = (accountId, query) => {
  const { filter, dateRange, search } = query;

  let options = {
    where: {
      accountId,
      purchaseDate: {
        [Op.gte]: dateRange.startDate,
        [Op.lte]: dateRange.endDate,
      },
      ...pick(filter, keys(Order.rawAttributes)),
    },
  };

  if ('withNotes' in filter) {
    const operator = filter.withNotes ? '>' : '=';

    options.where[Op.and] = {
      [Op.and]: [
        literal(
          `(SELECT COUNT(*) FROM notes WHERE notes."amazonOrderId" = "Order"."amazonOrderId") ${operator} 0`
        ),
      ],
    };
  }

  if (search) {
    options.where.amazonOrderId = {
      [Op.iLike]: `%${search}%`,
    };
  }

  if (filter.asin) {
    options.include = {
      model: OrderItem,
      attributes: [],
      where: { asin: filter.asin },
    };
  }

  return options;
};

/**
 * Get orders.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getOrdersByAccountId = async (accountId, query) => {
  const { pageSize, pageOffset, sort } = query;
  const baseOptions = transformQueryToOptions(accountId, query);

  const orders = await Order.findAndCountAll({
    ...baseOptions,
    attributes: [
      'orderStatus',
      'purchaseDate',
      'amazonOrderId',
      'lastUpdateDate',
      'fulfillmentChannel',
      [
        literal(
          `(SELECT COUNT("noteId") FROM notes WHERE notes."amazonOrderId" = "Order"."amazonOrderId")`
        ),
        'notesCount',
      ],
    ],
    subQuery: false,
    limit: pageSize,
    offset: pageOffset,
    order: sort,
  });

  return orders;
};

/**
 * Get order summary by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getOrdersSummaryByAccountId = async (accountId, query) => {
  const baseOptions = transformQueryToOptions(accountId, query);

  const summary = await Order.findAll({
    ...baseOptions,
    attributes: ['orderStatus', [fn('COUNT', 'orderStatus'), 'count']],
    group: ['orderStatus'],
    subQuery: false,
    raw: true,
  });

  return summary;
};

/**
 * Get order summary by accountId group by state.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getOrdersSummaryByAccountIdGroupByState = async (accountId, query) => {
  const orderOptions = transformQueryToOptions(accountId, query);

  const summary = await OrderAddress.findAll({
    attributes: ['stateOrRegion', [fn('COUNT', 'amazonOrderId'), 'stateCount']],
    group: ['stateOrRegion'],
    include: { model: Order, attributes: [], ...orderOptions, required: true },
    raw: true,
  });

  return summary;
};

/**
 * Get Order by accountId and amazonOrderId.
 *
 * @param uuid accountId
 * @param string amazonOrderId
 * @param object filter
 * @returns
 */
const getOrderByAccountIdAndAmazonOrderId = async (
  accountId,
  amazonOrderId,
  query,
  relations = false
) => {
  let options = {
    where: {
      accountId,
      amazonOrderId,
      ...pick(query, keys(Order.rawAttributes)),
    },
  };

  if (relations) {
    options.include = [
      {
        model: OrderItem,
        attributes: [
          'orderItemId',
          'asin',
          'sellerSku',
          'title',
          'quantityOrdered',
          'itemTaxAmount',
          'itemStatus',
          'itemPriceAmount',
        ],
      },
      {
        model: OrderAddress,
        attributes: [
          'amazonOrderId',
          'city',
          'stateOrRegion',
          'postalCode',
          'countryCode',
        ],
      },
    ];
  }

  const order = await Order.findOne(options);

  return order;
};

module.exports = {
  getOrdersByAccountId,
  getOrdersSummaryByAccountId,
  getOrderByAccountIdAndAmazonOrderId,
  getOrdersSummaryByAccountIdGroupByState,
};
