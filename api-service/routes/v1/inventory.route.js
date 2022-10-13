const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validate');

const {
  paginate,
  withFilters,
  withSort,
} = require('../../middleware/advancedList.js');

const { account, marketplace } = require('../../middleware/access');
const { protect } = require('../../middleware/auth.js');

const {
  getInventoryList,
  addInventoryCost,
  updateInventory,
  updateInventoryCost,
  deleteInventoryCost,
  getInventoryCostList,
} = require('../../controllers/client/inventory');

const {
  getInventoryListRequest,
  getInventoryCostListRequest,
  addInventoryCostRequest,
  updateInventoryRequest,
  updateInventoryCostRequest,
  deleteInventoryCostRequest,
} = require('../../validations/inventory.validation');

router.get(
  '/',
  validate(getInventoryListRequest),
  protect,
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getInventoryList
);

router.get(
  '/:inventoryItemId/costs',
  validate(getInventoryCostListRequest),
  protect,
  account,
  marketplace,
  paginate,
  withSort,
  getInventoryCostList
);

router.post(
  '/:inventoryItemId/costs',
  validate(addInventoryCostRequest),
  protect,
  account,
  marketplace,
  addInventoryCost
);

router.put(
  '/:inventoryItemId/costs/:productCostId',
  validate(updateInventoryCostRequest),
  protect,
  account,
  marketplace,
  updateInventoryCost
);

router.put(
  '/:inventoryItemId',
  validate(updateInventoryRequest),
  protect,
  account,
  marketplace,
  updateInventory
);

router.delete(
  '/:inventoryItemId/costs/:productCostId',
  validate(deleteInventoryCostRequest),
  protect,
  account,
  marketplace,
  deleteInventoryCost
);

module.exports = router;
