const asyncHandler = require('@middleware/async');
const ErrorResponse = require('@utils/errorResponse');
const { Parser } = require('json2csv');
const {
  getActiveSubscriptions,
  getChurnedSubscriptions,
  getChurnReport,
  getChurnReportQuarterly,
} = require('../../services/reports.churn.service');

// @desc     Get All Invoices filtered by status and/or subscriptionId
// @route    POST /api/v1/agency/invoice/errors
// @params   Allowed values for status: Pending, Resolved
// @access   Private
exports.getChurnData = asyncHandler(async (req, res, next) => {
  const { range } = req.params;

  //const output = await getChurnReport(range);
  const output =
    range === 'quarterly'
      ? await getChurnReportQuarterly()
      : await getChurnReport();

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get All Invoices filtered by status and/or subscriptionId
// @route    POST /api/v1/agency/invoice/errors
// @params   Allowed values for status: Pending, Resolved
// @access   Private
exports.exportChurnData = asyncHandler(async (req, res, next) => {
  const { range } = req.params;

  const { out } =
    range === 'quarterly'
      ? await getChurnReportQuarterly()
      : await getChurnReport();

  const rows = out.map((row) => {
    const {
      month,
      data: {
        active,
        ['new']: newClients,
        cancelled,
        churnRate,
        totalActiveEnd,
        activePercentage,
      },
    } = row;

    return {
      month,
      active,
      ['new']: newClients,
      cancelled,
      churnRate,
      totalActiveEnd,
      activePercentage,
    };
  });

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(rows);

  res.header('Content-Type', 'text/csv');
  res.attachment(`churn-data-${range}.csv`);
  return res.send(csv);
});

exports.getChurnedSubscriptions = asyncHandler(async (req, res, next) => {});
