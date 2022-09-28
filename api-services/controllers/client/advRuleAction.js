const asyncHandler = require('../../middleware/async');

const { listAdvRuleActions } = require('../../services/advRuleAction.service');

// @desc     Get advRule list.
// @route    GET /api/v1/ppc/rules
// @access   Private
exports.getAdvRuleActionList = asyncHandler(async (req, res, next) => {
  const data = await listAdvRuleActions(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});
