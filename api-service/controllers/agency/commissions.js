const asyncHandler = require('../../middleware/async');
const { Commission, AgencyClient } = require('../../models');
const {
  computeMonthlyCommission,
  createCommission,
  updateCommission,
  getOrderMetrics,
  getBenchmarkAvg,
  getBenchmarkAvgManagedAsins,
  getBenchmarkAvgAsin,
  getRollingAvgManagedAsins,
  getYearlySalesDifference,
} = require('../../services/commission.services');
const moment = require('moment');
const {
  addAgencyClientLogWithAccountId,
  updateAgencyClient,
} = require('../../services/agencyClient.service');
const emitter = require('../../events/emitter');

// @desc     Add Commission to Subscription
// @route    POST /api/agency/commission
// @access   Private - Admin only
exports.addCommission = asyncHandler(async (req, res, next) => {
  const {
    accountId,
    marketplaceId,
    rate,
    type,
    monthThreshold,
    commence,
    preContractAvgBenchmark,
    rules,
    managedAsins,
    agencyClientId,
    noCommission,
  } = req.body;
  const { userId } = req.user;

  const output = await createCommission({
    accountId,
    marketplaceId,
    rate,
    rules,
    type,
    monthThreshold,
    preContractAvgBenchmark,
    managedAsins,
    commence,
  });

  if (noCommission) {
    emitter.emit('clearNoCommission', agencyClientId);
  }

  await addAgencyClientLogWithAccountId(accountId, {
    tags: 'commission',
    message: `add ${type} with rate: ${rate}%`,
    addedBy: userId,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get Commission
// @route    GET /api/agency/commission/{commissionId}
// @access   Private - Admin only
exports.getCommission = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;

  const output = await Commission.findByPk(commissionId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Commission
// @route    PUT /api/agency/commission/{commissionId}
// @access   Private - Admin only
exports.updateCommission = asyncHandler(async (req, res, next) => {
  const {
    params: { commissionId },
    body: {
      rate,
      type,
      rules,
      marketplaceId,
      monthThreshold,
      preContractAvgBenchmark,
      managedAsins,
      commence,
    },
    user: { userId },
  } = req;

  const output = await updateCommission({
    commissionId,
    marketplaceId,
    rate,
    rules,
    type,
    monthThreshold,
    preContractAvgBenchmark,
    managedAsins,
    commence,
  });

  await addAgencyClientLogWithAccountId(output.accountId, {
    tags: 'commission',
    message: `update commission id# ${commissionId}`,
    addedBy: userId,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Commission
// @route    DELETE /api/agency/commission/{commissionId}
// @access   Private - Admin only
exports.deleteCommission = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;

  const commission = await Commission.findByPk(commissionId);

  const output = await Commission.destroy({
    where: { commissionId },
  });

  const count = await Commission.count({
    where: { accountId: commission.accountId },
  });

  if (count < 1) {
    const client = await AgencyClient.findOne({
      where: { accountId: commission.accountId },
    });
    emitter.emit('addNoCommission', client.agencyClientId);
  }

  res.status(200).json({
    success: true,
    output:
      count < 1
        ? {
            noCommission: true,
            noCommissionReason: 'No commission added',
            message: 'deleted',
          }
        : { message: 'deleted' },
  });
});

// @desc     Compute Monthly Commissions for Subscription
// @route    POST /api/agency/commission/compute
// @access   Private
exports.computeCommission = asyncHandler(async (req, res, next) => {
  const { accountId, invoiceDate } = req.body;

  // * settings this to false will enable computation for
  // * commission that is not marked as auto-add
  const isAuto = false;

  const output = await computeMonthlyCommission({
    accountId,
    invoiceDate,
    isAuto,
  });

  // * commission must be greater than 0
  const allowedItems = output.filter((r) => r.computed.rateTotal > 0);
  const notadded = output.filter((r) => r.computed.rateTotal <= 0);

  res.status(200).json({
    success: true,
    output: allowedItems,
    notadded,
  });
});

exports.getOrderMetrics = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;
  const { startDate, endDate, asin } = req.body;
  const commission = await Commission.findByPk(commissionId);

  const output = await getOrderMetrics(
    commission.accountId,
    commission.marketplaceId,
    moment(startDate).format(),
    moment(endDate).format(),
    asin ?? null
  );

  res.status(200).json({
    success: true,
    output,
  });
});

exports.getOrderMetricsCustom = asyncHandler(async (req, res, next) => {
  const { accountId, marketplaceId, startDate, endDate, asin } = req.body;

  const output = await getOrderMetrics(
    accountId,
    marketplaceId,
    moment(startDate).format(),
    moment(endDate).format(),
    asin ?? null
  );

  res.status(200).json({
    success: true,
    output,
  });
});

exports.getBenchmarkAverage = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;
  const commission = await Commission.findByPk(commissionId);

  //const output = await getBenchmarkAvg(commission);
  const output = await getBenchmarkAvgManagedAsins(commission);

  res.status(200).json({
    success: true,
    output,
  });
});

exports.getBenchmarkAverageAsin = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;
  const { asin, start, end } = req.body;
  const commission = await Commission.findByPk(commissionId);

  const output = await getBenchmarkAvgAsin(
    commission.accountId,
    commission.marketplaceId,
    moment(start).format(),
    moment(end).format(),
    asin
  );

  res.status(200).json({
    success: true,
    output,
  });
});

exports.getBenchmarkAverageAll = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;
  const commission = await Commission.findByPk(commissionId);

  const output = await getBenchmarkAvg(commission);
  //const output = await getBenchmarkAvgManagedAsins(commission);

  res.status(200).json({
    success: true,
    output,
  });
});

exports.getRollingAverage = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;
  const { start } = req.body;
  const commission = await Commission.findByPk(commissionId);

  const output = await getRollingAvgManagedAsins(commission, start);

  res.status(200).json({
    success: true,
    output,
  });
});

exports.getYearlySalesDifference = asyncHandler(async (req, res, next) => {
  const { commissionId } = req.params;
  const { endDate } = req.body;
  const commission = await Commission.findByPk(commissionId);

  const output = await getYearlySalesDifference(
    commission,
    moment(endDate).format()
  );

  res.status(200).json({
    success: true,
    output,
  });
});
