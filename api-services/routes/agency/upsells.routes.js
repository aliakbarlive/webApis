const express = require('express');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const router = express.Router();

const { paginate, withSort } = require('../../middleware/advancedList');
const {
  addUpsellItem,
  updateUpsellItem,
  deleteUpsellItem,
  addUpsellLog,
  getUpsellLogs,
  deleteUpsellLog,
  addUpsell,
  getUpsell,
  getUpsells,
  updateUpsell,
  deleteUpsell,
  getUpsellOrderComments,
  addUpsellOrderComment,
  deleteUpsellOrderComment,
  addUpsellOrder,
  updateUpsellOrder,
  deleteUpsellOrder,
  getUpsellOrders,
  getUpsellOrder,
  getUpsellItems,
  getUpsellItem,
  getUpsellItemsList,
  generateUpsellInvoice,
  checkUpsellInvoiceStatus,
  sendBillingSummary,
  updateUpsellStatus,
} = require('../../controllers/agency/upsells');
const {
  upsellItemRequest,
  updateUpsellItemRequest,
  deleteUpsellItemRequest,
  getUpsellLogRequest,
  addUpsellLogRequest,
  deleteUpsellLogRequest,
  addUpsellRequest,
  upsellRequest,
  updateUpsellRequest,
  deleteUpsellRequest,
  upsellOrderCommentRequest,
  addUpsellOrderCommentRequest,
  upsellOrderRequest,
  updateUpsellOrderRequest,
  deleteUpsellOrderRequest,
} = require('../../validations/upsell.validation');

router.get('/', protect, paginate, withSort, getUpsells);
router.post('/', validate(addUpsellRequest), protect, addUpsell);
router.get('/list/items', protect, getUpsellItemsList);
router.get('/item', protect, paginate, withSort, getUpsellItems);
router.post('/item', validate(upsellItemRequest), protect, addUpsellItem);
router.get(
  '/item/:id',
  validate(deleteUpsellItemRequest),
  protect,
  getUpsellItem
);
router.put(
  '/item/:id',
  validate(updateUpsellItemRequest),
  protect,
  updateUpsellItem
);
router.delete(
  '/item/:id',
  validate(deleteUpsellItemRequest),
  protect,
  deleteUpsellItem
);

// Upsell Order Comments
router.post(
  '/order/comment',
  validate(addUpsellOrderCommentRequest),
  protect,
  addUpsellOrderComment
);
router.delete(
  '/order/comment/:id',
  validate(upsellOrderCommentRequest),
  protect,
  deleteUpsellOrderComment
);
router.get(
  '/order/:id/comments',
  validate(upsellOrderCommentRequest),
  protect,
  getUpsellOrderComments
);

// Upsell Logs
router.get(
  '/:upsellId/logs',
  validate(getUpsellLogRequest),
  protect,
  getUpsellLogs
);
router.post('/log', validate(addUpsellLogRequest), protect, addUpsellLog);
router.delete(
  '/:upsellId/logs/:upsellLogId',
  validate(deleteUpsellLogRequest),
  protect,
  deleteUpsellLog
);

router.get('/order', protect, paginate, withSort, getUpsellOrders);
router.post('/order', validate(upsellOrderRequest), protect, addUpsellOrder);
router.get('/order/:id', validate(deleteUpsellOrderRequest), getUpsellOrder);
router.put(
  '/order/:id',
  validate(updateUpsellOrderRequest),
  protect,
  updateUpsellOrder
);
router.delete(
  '/order/:id',
  validate(deleteUpsellOrderRequest),
  protect,
  deleteUpsellOrder
);

router.get('/:id', validate(upsellRequest), protect, getUpsell);
router.put('/:id', validate(updateUpsellRequest), protect, updateUpsell);
router.patch('/:id', protect, updateUpsellStatus);
router.delete('/:id', validate(deleteUpsellRequest), protect, deleteUpsell);
router.post('/:id/send', protect, sendBillingSummary);
router.post('/:id/invoice/generate', protect, generateUpsellInvoice);
router.post('/:id/invoice/check', protect, checkUpsellInvoiceStatus);

module.exports = router;
