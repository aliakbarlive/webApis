const ErrorResponse = require('../../utils/errorResponse');

const asyncHandler = require('../../middleware/async');
const {
  getCategoriesByAccountId,
  getCategoriesByAccountIdAndId,
} = require('../../services/category.service');

// @desc     Get category list.
// @route    GET /api/v1/categories
// @access   Private
exports.getCategoryList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { pageSize, page } = req.query;

  const { count, rows } = await getCategoriesByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: {
      page,
      pageSize,
      count,
      rows,
    },
  });
});

// @desc     Get category.
// @route    GET /api/v1/categories/:categoryId
// @access   Private
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { categoryId } = req.params;

  const category = await getCategoriesByAccountIdAndId(
    accountId,
    categoryId,
    req.query
  );

  if (!category) throw new ErrorResponse('Category not found.', 404);

  res.status(200).json({
    success: true,
    data: category,
  });
});
