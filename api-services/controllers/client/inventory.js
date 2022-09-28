const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');

const {
  getInventoriesByAccountId,
  getInventoryByAccountIdAndId,
  updateInventory,
} = require('../../services/inventory.service');
const {
  getCostsByInventoryItemId,
  updateInventoryCostById,
  getCostByInventoryItemIdAndCostId,
  addCostByInventoryItemId,
  deleteCostByInventoryItemIdAndCostId,
} = require('../../services/cost.service');

// @desc     Get inventory list.
// @route    GET /api/v1/inventory
// @access   Private
exports.getInventoryList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const data = await getInventoriesByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get inventory cost list.
// @route    GET /api/v1/inventory/:inventoryItemId/costs
// @access   Private
exports.getInventoryCostList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { inventoryItemId } = req.params;
  const { page, pageSize } = req.query;

  const inventoryItem = await getInventoryByAccountIdAndId(
    accountId,
    inventoryItemId,
    { marketplaceId }
  );

  if (!inventoryItem) throw new ErrorResponse('Inventory not found.', 404);

  const { rows, count } = await getCostsByInventoryItemId(
    inventoryItemId,
    req.query
  );

  res.status(200).json({
    success: true,
    data: { rows, count, page, pageSize },
  });
});

// @desc     Add inventory costs.
// @route    POST /api/v1/inventory/:inventoryItemId/costs
// @access   Private
exports.addInventoryCost = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { inventoryItemId } = req.params;

  const inventoryItem = await getInventoryByAccountIdAndId(
    accountId,
    inventoryItemId,
    { marketplaceId }
  );

  if (!inventoryItem) throw new ErrorResponse('Inventory not found.', 404);

  const cost = await addCostByInventoryItemId(inventoryItemId, req.body);

  res.status(200).json({
    success: true,
    data: cost,
  });
});

// @desc     Update inventory costs.
// @route    PUT /api/v1/inventory/:inventoryItemId/costs/:productCostId
// @access   Private
exports.updateInventory = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { inventoryItemId } = req.params;

  const inventoryItem = await getInventoryByAccountIdAndId(
    accountId,
    inventoryItemId,
    { marketplaceId }
  );

  if (!inventoryItem) throw new ErrorResponse('Inventory not found.', 404);

  inventory = await updateInventory(inventoryItemId, req.body);

  res.status(200).json({
    success: true,
    data: inventory,
  });
});

// @desc     Update inventory costs.
// @route    PUT /api/v1/inventory/:inventoryItemId/costs/:productCostId
// @access   Private
exports.updateInventoryCost = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { inventoryItemId, productCostId } = req.params;

  const inventoryItem = await getInventoryByAccountIdAndId(
    accountId,
    inventoryItemId,
    { marketplaceId }
  );

  if (!inventoryItem) throw new ErrorResponse('Inventory not found.', 404);

  let cost = await getCostByInventoryItemIdAndCostId(
    inventoryItemId,
    productCostId
  );

  if (!cost) throw new ErrorResponse('Cost not found.', 404);

  cost = await updateInventoryCostById(productCostId, req.body);

  res.status(200).json({
    success: true,
    data: cost,
  });
});

// @desc     Delete inventory costs.
// @route    DELETE /api/v1/inventory/:inventoryItemId/costs/:productCostId
// @access   Private
exports.deleteInventoryCost = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { inventoryItemId, productCostId } = req.params;

  const inventoryItem = await getInventoryByAccountIdAndId(
    accountId,
    inventoryItemId,
    { marketplaceId }
  );

  if (!inventoryItem) throw new ErrorResponse('Inventory not found.', 404);

  const deleted = await deleteCostByInventoryItemIdAndCostId(
    inventoryItemId,
    productCostId
  );

  if (!deleted) throw new ErrorResponse('Cost not found.', 404);

  res.status(200).json({
    success: true,
  });
});
