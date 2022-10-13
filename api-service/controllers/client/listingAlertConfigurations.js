const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

const {
  updateListingAlertConfiguration,
  getListingAlertConfigsByAccountId,
  getListingAlertConfigByAccountIdAndConfigId,
  getListingAlertConfigSummaryByAccountId,
} = require('../../services/listingAlertConfigurations.service');

// @desc     Get listings alert configs
// @route    GET /api/v1/listings/alert-configs/summary
// @access   Private
exports.getListingAlertConfigsSummary = asyncHandler(async (req, res) => {
  const { accountId } = req.account;

  const data = await getListingAlertConfigSummaryByAccountId(accountId);

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get listings alert configs
// @route    GET /api/v1/listings/alert-configs
// @access   Private
exports.getListingAlertConfigs = asyncHandler(async (req, res) => {
  const { page, pageSize } = req.query;

  const { count, rows } = await getListingAlertConfigsByAccountId(
    req.account.accountId,
    req.query
  );

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
    },
  });
});

// @desc     Update single listing alert config
// @route    PUT /api/v1/listings/alert-configs/:listingAlertConfigurationId
// @access   Private
exports.updateListingAlertConfig = asyncHandler(async (req, res) => {
  const listingAlertConfiguration =
    await getListingAlertConfigByAccountIdAndConfigId(
      req.account.accountId,
      req.params.listingAlertConfigurationId,
      { marketplaceId: req.body.marketplaceId }
    );

  if (!listingAlertConfiguration) {
    throw new ErrorResponse('Listing alert configuration not found', 404);
  }

  await updateListingAlertConfiguration(listingAlertConfiguration, req.body);

  res.status(200).json({
    success: true,
    message: 'Listing Configuration successfully updated.',
    data: listingAlertConfiguration,
  });
});
