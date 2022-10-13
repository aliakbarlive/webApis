const express = require('express');
const router = express.Router();

const {
  getInboundShipment,
  getInboundShipments,
} = require('../../controllers/client/inboundFbaShipment.js');

const {
  paginate,
  withFilters,
  withSort,
} = require('../../middleware/advancedList.js');

const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth.js');
const { account } = require('../../middleware/access');

const {
  getInboundShipmentRequest,
  getInboundShipmentsRequest,
} = require('../../validations/inboundFBAShipment.validation');

router.get(
  '/',
  validate(getInboundShipmentsRequest),
  protect,
  account,
  paginate,
  withFilters,
  withSort,
  getInboundShipments
);

router.get(
  '/:inboundFBAShipmentId',
  validate(getInboundShipmentRequest),
  protect,
  account,
  paginate,
  withFilters,
  withSort,
  getInboundShipment
);

module.exports = router;
