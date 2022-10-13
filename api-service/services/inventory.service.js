const moment = require('moment');
const { pick, keys } = require('lodash');
const { Op, literal } = require('sequelize');

const { Listing, InventoryItem, InventoryDetail } = require('../models');

const { paginate } = require('./pagination.service');

/**
 * Get Inventories by accountId and query.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getInventoriesByAccountId = async (accountId, query) => {
  let {
    filter,
    page,
    pageSize: limit,
    pageOffset: offset,
    sort,
    include,
  } = query;

  const fromOrderItems = `
		FROM "orderItems"
		LEFT JOIN
			orders ON orders."amazonOrderId" = "orderItems"."amazonOrderId"
		LEFT JOIN 
			products ON "orderItems".asin = products.asin
		WHERE 
			products.asin = "InventoryItem".asin
			AND products."accountId" = '${accountId}'
			AND orders."marketplaceId" = '${filter.marketplaceId}'
			AND orders."purchaseDate" >= '${moment()
        .startOf('day')
        .subtract(28, 'days')
        .format()}'
	`;

  const fromProductCosts = `FROM "productCosts" WHERE "InventoryItem"."inventoryItemId" = "productCosts"."inventoryItemId" order by "productCosts"."startDate" desc limit 1`;

  const includeOptions = {
    details: {
      relation: {
        model: InventoryDetail,
        required: true,
        as: 'details',
        attributes: {
          exclude: [
            'researchingQuantity',
            'unfulfillableQuantity',
            'createdAt',
            'updatedAt',
          ],
        },
      },
      attributes: [
        [
          literal(
            `(SELECT CASE WHEN SUM("orderItems"."quantityOrdered") IS NULL OR SUM("orderItems"."quantityOrdered") = 0 THEN 0.00::DOUBLE PRECISION 
                ELSE (SUM("orderItems"."quantityOrdered") / 28.00)::DOUBLE PRECISION 
              END ${fromOrderItems}
            )`
          ),
          'salesVelocity',
        ],
        [
          literal(
            `(SELECT CASE WHEN SUM("orderItems"."quantityOrdered") IS NULL OR SUM("orderItems"."quantityOrdered") = 0 OR "details"."inventoryDetailId" = 0 THEN 0::INTEGER
                ELSE ("details"."inventoryDetailId" / (SUM("orderItems"."quantityOrdered") / 28.00))::INTEGER
              END ${fromOrderItems}
            )`
          ),
          'outOfStock',
        ],
        [
          literal(
            `(SELECT CASE WHEN SUM("orderItems"."quantityOrdered") IS NULL OR SUM("orderItems"."quantityOrdered") = 0 OR "details"."inventoryDetailId" = 0 THEN 0::INTEGER
                ELSE ("details"."inventoryDetailId" / (SUM("orderItems"."quantityOrdered") / 28.00) - "InventoryItem"."leadTime")::INTEGER
              END ${fromOrderItems}
            )`
          ),
          'reorder',
        ],
      ],
    },
    costs: {
      attributes: [
        [
          literal(
            `(SELECT CAST("productCosts"."cogsAmount" AS int) ${fromProductCosts})`
          ),
          'cogsAmount',
        ],
        [
          literal(
            `(SELECT CAST("productCosts"."shippingAmount" AS int) ${fromProductCosts})`
          ),
          'shippingAmount',
        ],
        [
          literal(
            `(SELECT CAST("productCosts"."miscAmount" AS int) ${fromProductCosts})`
          ),
          'miscAmount',
        ],
        [
          literal(`(SELECT "productCosts"."startDate" ${fromProductCosts})`),
          'costStartDate',
        ],
        [
          literal(`(SELECT "productCosts"."endDate" ${fromProductCosts})`),
          'costEndDate',
        ],
        [
          literal(
            `(
              SELECT 
              CAST(("productCosts"."cogsAmount" + "productCosts"."shippingAmount" + "productCosts"."miscAmount") AS int) as totalAmount 
              ${fromProductCosts}
            )`
          ),
          'totalAmount',
        ],
      ],
    },
  };

  let options = {
    attributes: [
      'asin',
      'leadTime',
      'sellerSku',
      'productName',
      'totalQuantity',
      'inventoryItemId',
    ],
    where: {
      accountId,
      ...pick(filter, keys(InventoryItem.rawAttributes)),
    },
    include: [
      {
        model: Listing,
        required: true,
        where: pick(filter, keys(Listing.rawAttributes)),
        attributes: ['thumbnail', 'price'],
      },
    ],
    subQuery: false,
    offset,
    limit,
    order: sort,
  };

  // If includes relation.
  if (include) {
    const includeObj = includeOptions[include];

    // Add include model relation
    if (includeObj.relation) options.include.push(includeObj.relation);

    // Add include custom attributes.
    options.attributes.push(...includeObj.attributes);

    sort = sort.map((s) => {
      const customSortAttribute = includeObj.attributes.find(
        (attr) => attr[1] === s[0]
      );
      if (customSortAttribute) s[0] = customSortAttribute[0];

      return s;
    });
  }

  if (query.search) {
    options.where[Op.and] = {
      [Op.or]: ['asin', 'sellerSku', 'productName'].map((attribute) => {
        return {
          [attribute]: {
            [Op.iLike]: `%${query.search}%`,
          },
        };
      }),
    };
  }

  const { rows, count } = await InventoryItem.findAndCountAll(options);

  return paginate(rows, count, page, offset, limit);
};

/**
 * Get inventory by accountId and inventoryItemId.
 *
 * @param uuid accountId
 * @param int inventoryItemId
 * @param object query
 * @returns InventoryItem
 */
const getInventoryByAccountIdAndId = async (
  accountId,
  inventoryItemId,
  query
) => {
  const inventoryItem = await InventoryItem.findOne({
    where: {
      accountId,
      inventoryItemId,
      ...pick(query, keys(InventoryItem.rawAttributes)),
    },
  });

  return inventoryItem;
};

/**
 * Update inventory
 *
 * @param int inventoryItemId
 * @param object data
 * @returns inventoryItem
 */
const updateInventory = async (inventoryItemId, data) => {
  const inventory = await InventoryItem.update(
    pick(data, keys(InventoryItem.rawAttributes)),
    {
      where: { inventoryItemId },
    }
  );

  return inventory;
};

module.exports = {
  getInventoriesByAccountId,
  getInventoryByAccountIdAndId,
  updateInventory,
};
