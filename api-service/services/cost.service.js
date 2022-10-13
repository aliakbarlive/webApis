const { Op } = require('sequelize');
const moment = require('moment');
const { pick, keys } = require('lodash');
const { ProductCost } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Get Costs By inventoryItemId.
 *
 * @param int inventoryItemId
 * @param object query
 * @returns object
 */
const getCostsByInventoryItemId = async (inventoryItemId, query) => {
  const { pageSize: limit, pageOffset: offset, sort } = query;
  const costs = await ProductCost.findAndCountAll({
    where: { inventoryItemId },
    order: sort,
    offset,
    limit,
  });

  return costs;
};

/**
 * Get specific cost By inventoryItemId and productCostId
 *
 * @param int inventoryItemId
 * @param int productCostId
 * @returns ProductCost
 */
const getCostByInventoryItemIdAndCostId = async (
  inventoryItemId,
  productCostId
) => {
  const cost = await ProductCost.findOne({
    where: {
      inventoryItemId,
      productCostId,
    },
  });

  return cost;
};

/**
 * Check if intenventory item has cost on specific startDate.
 *
 * @param int inventoryItemId
 * @param int productCostId
 * @returns ProductCost
 */
const checkIfExistsByInventoryItemIdAndStartDate = async (
  inventoryItemId,
  startDate,
  ignoreCostId = null
) => {
  let options = {
    where: {
      startDate: moment(startDate).utc().startOf('d').format(),
      inventoryItemId,
    },
  };

  if (ignoreCostId) {
    options.where.productCostId = {
      [Op.not]: ignoreCostId,
    };
  }

  const exists = await ProductCost.count(options);

  return !!exists;
};

/**
 * Add Cost to inventory
 *
 * @param int inventoryItemId
 * @param object data
 * @returns ProductCost
 */
const addCostByInventoryItemId = async (inventoryItemId, data) => {
  const costExists = await checkIfExistsByInventoryItemIdAndStartDate(
    inventoryItemId,
    data.startDate
  );

  if (costExists) {
    throw new ErrorResponse('Inventory already have costs for this date.', 400);
  }

  const cost = await ProductCost.create({
    inventoryItemId,
    ...pick(data, keys(ProductCost.rawAttributes)),
  });

  await syncCostsEffectivityDate(inventoryItemId);

  await cost.reload();

  return cost;
};

/**
 * Update inventory cost by productCostId
 *
 * @param int productCostId
 * @param object data
 * @returns ProductCost
 */
const updateInventoryCostById = async (productCostId, data) => {
  const cost = await ProductCost.findByPk(productCostId);
  const { inventoryItemId } = cost;

  const costExists = await checkIfExistsByInventoryItemIdAndStartDate(
    inventoryItemId,
    data.startDate,
    productCostId
  );

  if (costExists) {
    throw new ErrorResponse('Inventory already have costs for this date.', 400);
  }

  await cost.update(pick(data, keys(ProductCost.rawAttributes)));

  await syncCostsEffectivityDate(inventoryItemId);

  await cost.reload();

  return cost;
};

/**
 * Delete cost by inventoryItemId and productCostId
 *
 * @param int inventoryItemId
 * @param int productCostId
 * @returns int
 */
const deleteCostByInventoryItemIdAndCostId = async (
  inventoryItemId,
  productCostId
) => {
  const deleted = await ProductCost.destroy({
    where: {
      inventoryItemId,
      productCostId,
    },
  });

  return deleted;
};

/**
 * Sync inventory costs.
 *
 * @param id inventoryItemId
 */
const syncCostsEffectivityDate = async (inventoryItemId) => {
  const costs = await ProductCost.findAll({
    atttibutes: ['productCostId', 'startDate', 'endDate'],
    where: { inventoryItemId },
    order: [['startDate', 'ASC']],
  });

  await Promise.all(
    costs.map(async (cost, index) => {
      const nextIndex = index + 1;
      const endDate = costs[nextIndex]
        ? moment(costs[nextIndex].startDate)
            .utc()
            .subtract(1, 'days')
            .endOf('d')
            .format()
        : '3000-01-01';

      await cost.update({
        endDate,
      });
    })
  );
};

module.exports = {
  addCostByInventoryItemId,
  updateInventoryCostById,
  getCostsByInventoryItemId,
  getCostByInventoryItemIdAndCostId,
  deleteCostByInventoryItemIdAndCostId,
};
