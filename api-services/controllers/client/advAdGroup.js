const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');

const {
  getAdvAdGroups,
  getAdvAdGroupById,
  getAdvAdGroupStatistics,
  getAdvAdGroupRecords,
} = require('../../services/advAdGroup.service');

// @desc     Get Ad group list.
// @route    GET /api/v1/ppc/ad-groups
// @access   Private
exports.getAdGroupList = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { pageSize, page } = req.query;

  const { rows, count } = await getAdvAdGroups(advProfileId, req.query);

  res.status(200).json({
    success: true,
    data: {
      rows,
      count,
      page,
      pageSize,
    },
  });
});

// @desc     Get Ad group details.
// @route    GET /api/v1/ppc/ad-groups/:advAdGroupId
// @access   Private
exports.getAdvAdGroupDetails = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { advAdGroupId } = req.params;

  const advAdGroup = await getAdvAdGroupById(advProfileId, advAdGroupId, true);

  if (!advAdGroup) {
    throw new ErrorResponse('Advertising Ad Group not found', 404);
  }

  res.status(200).json({
    success: true,
    data: advAdGroup,
  });
});

// @desc     Get Ad group statistics.
// @route    GET /api/v1/ppc/ad-groups/:advAdGroupId/statistics
// @access   Private
exports.getAdvAdGroupStatistics = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { advAdGroupId } = req.params;

  const advAdGroup = await getAdvAdGroupById(advProfileId, advAdGroupId);

  if (!advAdGroup) {
    throw new ErrorResponse('Advertising Ad Group not found', 404);
  }

  const statistics = await getAdvAdGroupStatistics(advAdGroup, req.query);

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

// @desc     Get Ad group records.
// @route    GET /api/v1/ppc/ad-groups/:advAdGroupId/records
// @access   Private
exports.getAdvAdGroupRecords = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { advAdGroupId } = req.params;

  const advAdGroup = await getAdvAdGroupById(advProfileId, advAdGroupId);

  if (!advAdGroup) {
    throw new ErrorResponse('Advertising Ad Group not found', 404);
  }

  const records = await getAdvAdGroupRecords(advAdGroup, req.query);

  res.status(200).json({
    success: true,
    data: records,
  });
});
