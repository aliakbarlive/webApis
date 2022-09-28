const asyncHandler = require('@middleware/async');

const { listSearchTermsByProfile } = require('./searchTerm.service');

// @desc     List search-terms.
// @route    GET /api/v1/advertising/search-terms
// @access   Private
exports.listSearchTerms = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listSearchTermsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
