const asyncHandler = require('../../middleware/async');

const {
  getKeywordsByAccountId,
  getKeywordByAccountIdAndId,
  updateKeywordDetails,
  addKeywordToListing,
  searchKeywordsByAccountId,
} = require('../../services/keyword.service');

const {
  getListingByAccountIdAndAsin,
} = require('../../services/listing.service');

const ErrorResponse = require('../../utils/errorResponse');

// @desc     List keywords
// @route    GET /api/v1/keywords
// @access   PRIVATE
exports.getKeywordList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { page, pageSize } = req.query;

  const keywords = await getKeywordsByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: { ...keywords, page, pageSize },
  });
});

// @desc     Get keyword details
// @route    GET /api/v1/keywords/:keywordId
// @access   PRIVATE
exports.getKeyword = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { keywordId } = req.params;

  const keyword = await getKeywordByAccountIdAndId(
    accountId,
    keywordId,
    req.query
  );

  if (!keyword) throw new ErrorResponse('Keyword not found.', 404);

  res.status(200).json({
    success: true,
    data: keyword,
  });
});

// @desc     Add keyword
// @route    POSt /api/v1/keywords/
// @access   PRIVATE
exports.addKeyword = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { asin } = req.body;

  const listing = await getListingByAccountIdAndAsin(accountId, asin, {
    marketplaceId,
  });

  if (!listing) throw new ErrorResponse('Product not found.', 404);

  const keyword = await addKeywordToListing(listing, req.body);

  res.status(200).json({
    success: true,
    data: keyword,
  });
});

// @desc     Update keyword
// @route    PUT /api/v1/keywords/:keywordId
// @access   PRIVATE
exports.updateKeyword = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { keywordId } = req.params;

  let keyword = await getKeywordByAccountIdAndId(accountId, keywordId, {
    marketplaceId,
  });

  if (!keyword) throw new ErrorResponse('Keyword not found.', 404);

  keyword = await updateKeywordDetails(keyword, req.body);

  res.status(200).json({
    success: true,
    data: keyword,
  });
});

// @desc     Search keywords
// @route    POST /api/v1/keywords/search
// @access   PRIVATE
exports.searchKeywords = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;

  await searchKeywordsByAccountId(accountId, req.body);

  res.status(200).json({
    success: true,
    data: 'Searching via queue.',
  });
});
