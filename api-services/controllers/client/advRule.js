const asyncHandler = require('../../middleware/async');

const {
  listAdvRulesByAccountId,
  createAdvRuleByAccountId,
  getAdvRuleByAccountIdAndId,
  updateAdvRuleByAccountIdAndId,
} = require('../../services/advRule.service');

// @desc     Get advRule list.
// @route    GET /api/v1/ppc/rules
// @access   Private
exports.getAdvRuleList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;

  const data = await listAdvRulesByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

exports.createAdvRule = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;

  const rule = await createAdvRuleByAccountId(accountId, req.body);

  res.status(200).json({
    success: true,
    message: 'Successfully created a new rule',
    data: rule,
  });
});

exports.getAdvRule = asyncHandler(async (req, res, next) => {
  const { advRuleId } = req.params;
  const { accountId } = req.account;

  const rule = await getAdvRuleByAccountIdAndId(accountId, advRuleId);

  res.status(200).json({
    success: true,
    data: rule,
  });
});

exports.updateAdvRule = asyncHandler(async (req, res, next) => {
  const { advRuleId } = req.params;
  const { accountId } = req.account;

  const rule = await updateAdvRuleByAccountIdAndId(
    accountId,
    advRuleId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Rule successfully updated',
    data: rule,
  });
});
