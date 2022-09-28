const asyncHandler = require('../../middleware/async');

const {
  listAdvChangeCollectionsByAdvProfileId,
} = require('../../services/advChangeCollection.service');

// @desc     Get Change Collection list.
// @route    GET /api/v1/ppc/change-collections
// @access   Private
exports.getAdvChangeCollectionList = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;

  const data = await listAdvChangeCollectionsByAdvProfileId(
    advProfileId,
    req.query
  );

  res.status(200).json({
    success: true,
    data,
  });
});
