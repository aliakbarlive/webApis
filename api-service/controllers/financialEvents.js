const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const moment = require('moment');
const {
  RefundEvent,
  ShipmentAdjustmentItem,
  ItemChargeAdjustment,
  ItemFeeAdjustment,
  ItemTaxWithheldAdjustment,
} = require('../models');
const { Op, fn, col } = require('sequelize');

// @desc      Get All Refund Events
// @route     POST /api/v1/financial-events/refunds
// @body      Body {startDate: "2021-01-01",endDate: "2021-01-01"}
// @access    Private
exports.getRefundEvents = asyncHandler(async (req, res, next) => {
  const {
    pageSize = 10,
    page = 1,
    sortField,
    sortOrder,
    startDate,
    endDate,
  } = req.query;

  if (!startDate || !moment(startDate).isValid()) {
    return next(new ErrorResponse('Please provide a valid startDate.', 400));
  }

  if (!endDate || !moment(endDate).isValid()) {
    return next(new ErrorResponse('Please provide a valid endDate.', 400));
  }

  if (!pageSize || !page) {
    return next(new ErrorResponse('Please provide a page and pageSize.', 400));
  }

  if (page < 1) {
    return next(new ErrorResponse('Please provide a page greater than 0', 400));
  }

  const refundsQuery = {
    where: {
      postedDate: {
        [Op.gte]: moment(startDate).startOf('day'),
        [Op.lte]: moment(endDate).endOf('day'),
      },
    },
    attributes: [
      'amazonOrderId',
      'postedDate',
      [
        fn(
          'sum',
          col('ShipmentAdjustmentItems->ItemChargeAdjustments.currencyAmount')
        ),
        'totalItemChargeAdjustments',
      ],
      [
        fn(
          'sum',
          col('ShipmentAdjustmentItems->ItemFeeAdjustments.currencyAmount')
        ),
        'totalItemFeeAdjustments',
      ],
    ],
    include: [
      {
        model: ShipmentAdjustmentItem,
        attributes: [],
        include: [
          {
            model: ItemChargeAdjustment,
            attributes: [],
          },
          {
            model: ItemFeeAdjustment,
            attributes: [],
          },
        ],
      },
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    group: ['RefundEvent.amazonOrderId'],
    subQuery: false,
    distinct: true,
  };

  if (sortField && sortOrder) {
    ordersQuery.order = [[sortField, sortOrder]];
  }

  const { rows, count } = await RefundEvent.findAndCountAll(refundsQuery);

  res.status(200).json({
    success: true,
    data: {
      count: parseInt(count.length),
      pagination: {
        page: parseInt(page),
        nextPage: page * pageSize < count.length ? parseInt(page) + 1 : null,
        pageSize: parseInt(pageSize),
      },
      rows,
    },
  });
});

// @desc      Get Refund Events By amazonOrderId
// @route     GET /api/v1/financial-events/refunds/:amazonOrderId
// @access    Private
exports.getRefundEvent = asyncHandler(async (req, res, next) => {
  const { amazonOrderId } = req.params;

  const refundEvents = await RefundEvent.findAll({
    where: { amazonOrderId },
    include: [
      {
        model: ShipmentAdjustmentItem,
        include: [
          ItemChargeAdjustment,
          ItemFeeAdjustment,
          ItemTaxWithheldAdjustment,
        ],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: { refundEvents },
  });
});
