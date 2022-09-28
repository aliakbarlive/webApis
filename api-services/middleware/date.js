const moment = require('moment');
const ErrorResponse = require('../utils/errorResponse');

exports.validateDates = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new ErrorResponse('Please provided a startDate and an endDate', 400)
    );
  }

  if (
    moment(startDate).isValid() === false ||
    moment(endDate).isValid() === false
  ) {
    return next(
      new ErrorResponse('Please provide a correct format for the dates!', 400)
    );
  }

  if (moment(startDate) > moment(endDate)) {
    return next(
      new ErrorResponse(
        'Please make sure startDate is older than or equal to the endDate!',
        400
      )
    );
  }
  next();
};

exports.validateView = (req, res, next) => {
  const { view } = req.query;

  if (view !== 'day' && view !== 'week' && view !== 'month') {
    return next(
      new ErrorResponse(
        'Please provide a valid view parameter! Either day | week | month',
        400
      )
    );
  }
  next();
};
