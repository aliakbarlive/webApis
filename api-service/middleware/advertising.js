const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

exports.checkIfAllowedToSubmitChanges = asyncHandler(async (req, res, next) => {
  const hasAccessToMakeChanges = [
    '79bde3f1-898b-4a2e-b8b0-ea5322648634',
    'd19587a1-fd99-4e7b-bde4-136e480e65ba',
    '08850065-e420-492d-9ce9-112ceb71b4e8',
  ];

  if (
    !hasAccessToMakeChanges.includes(req.user.userId) &&
    process.env.NODE_ENV !== 'production'
  ) {
    return next(
      new ErrorResponse(
        'Not allowed to apply changes in this environment. Please a use sandbox account.',
        400
      )
    );
  }

  next();
});
