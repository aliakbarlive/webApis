const { pick } = require('lodash');
const asyncHandler = require('../../middleware/async');
const { getSubscription } = require('../../services/subscription.service');
const {
  createUpsellItem,
  updateUpsellItem,
  deleteUpsellItem,
  getUpsellLogs,
  createUpsellLog,
  deleteUpsellLog,
  createUpsell,
  getUpsell,
  getUpsells,
  updateUpsell,
  deleteUpsell,
  getUpsellOrderComments,
  createUpsellOrderComment,
  deleteUpsellOrderComment,
  createUpsellOrder,
  updateUpsellOrder,
  deleteUpsellOrder,
  getUpsellOrders,
  getUpsellOrder,
  getUpsellItems,
  getUpsellItem,
  getUpsellItemsList,
  generateUpsellInvoice,
  checkInvoiceStatus,
  sendBillingSummary,
  updateUpsellStatus,
} = require('../../services/upsells.service');

// @desc     Get All Upsells
// @route    GET /api/v1/agency/upsells
// @access   PUBLIC
exports.getUpsells = asyncHandler(async (req, res, next) => {
  const { sort, page, pageSize, pageOffset, search, status, client } =
    req.query;

  const { count, rows } = await getUpsells({
    sort,
    page,
    pageSize,
    pageOffset,
    search,
    status,
    client,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
      search,
      status,
    },
  });
});

// @desc     Get Upsell
// @route    GET /api/v1/upsell/:id
// @access   Private
exports.getUpsell = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const output = await getUpsell(id);

  if (user.role.level === 'application') {
    const clientMatched = user.memberships.filter(
      (m) => m.account.AgencyClient.agencyClientId == output.agencyClientId
    );

    if (clientMatched.length <= 0) {
      return res.status(400).send({ message: 'invalid user' });
    }
  }

  const subscription = await getSubscription(
    output.agencyClient.account.subscription.subscriptionId
  );

  res.status(200).json({
    success: true,
    output,
    subscription,
  });
});

// @desc     Create Upsell
// @route    POST /api/v1/upsell
// @access   Private
exports.addUpsell = asyncHandler(async (req, res, next) => {
  const output = await createUpsell(req.body, req.user.userId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Upsell
// @route    POST /api/v1/upsell/:id
// @access   Private
exports.updateUpsell = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { userId } = req.user;

  const output = await updateUpsell(
    id,
    pick(req.body, [
      'agencyClientId',
      'requestedBy',
      'approvedBy',
      'status',
      'details',
      'soldBy',
      'commissionAmount',
    ]),
    userId
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Upsell
// @route    PATCH /api/v1/upsell/:id
// @access   Private
exports.updateUpsellStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { userId } = req.user;

  const output = await updateUpsellStatus(
    id,
    pick(req.body, ['status']),
    userId
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Send Upsell Billing Summary
// @route    POST /api/v1/upsell/:id/send
// @access   Private
exports.sendBillingSummary = asyncHandler(async (req, res, next) => {
  const { id: upsellId } = req.params;
  const { subscriptionId } = req.body;
  const { userId } = req.user;

  const output = await sendBillingSummary(upsellId, subscriptionId, userId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Generate Upsell Invoice
// @route    POST /api/v1/upsell/:id/invoice/generate
// @access   Private
exports.generateUpsellInvoice = asyncHandler(async (req, res, next) => {
  const { id: upsellId } = req.params;
  const { subscriptionId } = req.body;
  const { userId } = req.user;

  const output = await generateUpsellInvoice(upsellId, subscriptionId, userId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Check Upsell Invoice Status
// @route    POST /api/v1/upsell/:id/invoice/check
// @access   Private
exports.checkUpsellInvoiceStatus = asyncHandler(async (req, res, next) => {
  const { id: upsellId } = req.params;
  const { userId } = req.user;

  const output = await checkInvoiceStatus(upsellId, userId);
  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Upsell
// @route    DELETE /api/v1/upsell/:id
// @access   Private
exports.deleteUpsell = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await deleteUpsell(id);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get All Upsell Orders
// @route    GET /api/v1/agency/upsells/order
// @access   PUBLIC
exports.getUpsellOrders = asyncHandler(async (req, res, next) => {
  const { sort, page, pageSize, pageOffset, search, status, client } =
    req.query;

  const { count, rows } = await getUpsellOrders({
    sort,
    page,
    pageSize,
    pageOffset,
    search,
    status,
    client,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
      search,
      status,
    },
  });
});

// @desc     Get Upsell Order
// @route    GET /api/v1/agency/upsells/order/:id
// @access   PUBLIC
exports.getUpsellOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await getUpsellOrder(id);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Create Upsell Order
// @route    POST /api/v1/upsell/order
// @access   Private
exports.addUpsellOrder = asyncHandler(async (req, res, next) => {
  const { upsellId, assignedTo, eta, startedAt, completedAt } = req.body;
  const { userId } = req.user;

  const output = await createUpsellOrder(
    {
      upsellId,
      assignedTo,
      eta,
      startedAt,
      completedAt,
    },
    userId
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Upsell Order
// @route    PUT /api/v1/upsell/order/:id
// @access   Private
exports.updateUpsellOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { upsellId, assignedTo, eta, startedAt, completedAt, status } =
    req.body;
  const { userId } = req.user;

  const output = await updateUpsellOrder(
    id,
    {
      upsellId,
      assignedTo,
      eta,
      startedAt,
      completedAt,
      status,
    },
    userId
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Upsell Order
// @route    DELETE /api/v1/upsell/order/:id
// @access   Private
exports.deleteUpsellOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await deleteUpsellOrder(id);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get All Upsell Items
// @route    GET /api/v1/agency/upsells/item
// @access   PUBLIC
exports.getUpsellItems = asyncHandler(async (req, res, next) => {
  const { sort, page, pageSize, pageOffset, search, status } = req.query;

  const { count, rows } = await getUpsellItems({
    sort,
    page,
    pageSize,
    pageOffset,
    search,
    status,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
      search,
      status,
    },
  });
});

// @desc     Get All Upsell Items List (for dropdowns)
// @route    GET /api/v1/agency/upsells/list/items
// @access   PUBLIC
exports.getUpsellItemsList = asyncHandler(async (req, res, next) => {
  const data = await getUpsellItemsList();

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get Upsell Item
// @route    GET /api/v1/agency/upsells/item/:id
// @access   PUBLIC
exports.getUpsellItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await getUpsellItem(id);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Create Upsell Item
// @route    POST /api/v1/upsell/item
// @access   Private
exports.addUpsellItem = asyncHandler(async (req, res, next) => {
  const { name, description, code, price } = req.body;

  const output = await createUpsellItem({
    name,
    description,
    code,
    price,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Upsell Item
// @route    PUT /api/v1/upsell/item/:id
// @access   Private
exports.updateUpsellItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, code, price } = req.body;

  const output = await updateUpsellItem(id, {
    name,
    description,
    code,
    price,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Upsell Item
// @route    DELETE /api/v1/upsell/item/:id
// @access   Private
exports.deleteUpsellItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await deleteUpsellItem(id);

  if (output === false) {
    res.status(400).json({
      success: false,
      output,
      message: 'Cannot delete item since it is currently in use',
    });
  } else {
    res.status(200).json({
      success: true,
      output,
    });
  }
});

// @desc     Create Upsell Log
// @body     { upsellId, description }
// @route    POST /api/v1/upsells/log
// @access   Private
exports.addUpsellLog = asyncHandler(async (req, res, next) => {
  const { userId: addedBy } = req.user;
  const output = await createUpsellLog({
    addedBy,
    isSystemGenerated: false,
    ...req.body,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get Logs by Upsell
// @route    POST /api/v1/upsells/:upsellId/logs
// @access   Private
exports.getUpsellLogs = asyncHandler(async (req, res, next) => {
  const { upsellId } = req.params;
  const output = await getUpsellLogs(upsellId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Upsell Log
// @route    DELETE /api/v1/upsells/:upsellId/logs/:upsellLogId
// @access   Private
exports.deleteUpsellLog = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const { upsellId, upsellLogId } = req.params;

  const response = await deleteUpsellLog(upsellId, upsellLogId, userId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
  });
});

// @desc     Get Comments by Upsell Order
// @route    GET /api/v1/upsells/order/:upsellOrderId/comments
// @access   Private
exports.getUpsellOrderComments = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const output = await getUpsellOrderComments(id);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Create Comment on an Upsell Order
// @body     { upsellOrderId, comment }
// @route    POST /api/v1/upsells/order/comment
// @access   Private
exports.addUpsellOrderComment = asyncHandler(async (req, res, next) => {
  const { userId: commentedBy } = req.user;
  const output = await createUpsellOrderComment({ commentedBy, ...req.body });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Comment from Upsell Order
// @route    DELETE /api/v1/upsells/order/comments/:upsellCommentId
// @access   Private
exports.deleteUpsellOrderComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await deleteUpsellOrderComment(id);

  res.status(200).json({
    success: true,
    output,
  });
});
