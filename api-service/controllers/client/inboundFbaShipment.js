const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

const {
  getInBoundFbaShipmentsByAccountId,
  getInBoundFbaShipmentByAccountIdAndId,
} = require('../../services/inboundFbaShipment.service');

// @desc     Get inbound shipment list.
// @route    GET /api/v1/inbound-fba-shipments
// @access   Private
exports.getInboundShipments = asyncHandler(async (req, res, next) => {
  const { pageSize, page } = req.query;
  const { rows, count } = await getInBoundFbaShipmentsByAccountId(
    req.account.accountId,
    req.query
  );

  return res.json({
    status: true,
    data: { count, page, pageSize, rows },
  });
});

// @desc     Get inbound shipment details.
// @route    GET /api/v1/inbound-fba-shipments/:inboundFBAShipmentId
// @access   Private
exports.getInboundShipment = asyncHandler(async (req, res, next) => {
  const shipment = await getInBoundFbaShipmentByAccountIdAndId(
    req.account.accountId,
    req.params.inboundFBAShipmentId,
    req.query
  );

  if (!shipment) throw new ErrorResponse('Shipment not found.', 404);

  return res.json({ status: true, data: shipment });
});
