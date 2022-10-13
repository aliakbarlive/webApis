const logger = require('../config/logger');
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  // console.log(err);
  // console.log(err.name);
  // console.log(err.message);

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    logger.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    code: error.statusCode,
    message: error.message || 'Server Error',
    errors: error.errors ?? undefined,
  });
};

module.exports = errorHandler;

// const httpStatus = require('http-status');
// const logger = require('../config/logger');

// // eslint-disable-next-line no-unused-vars
// const errorHandler = (err, req, res, next) => {
//   console.log(err);
//   let { statusCode, message } = err;
//   if (process.env.NODE_ENV === 'production' && !err.isOperational) {
//     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
//     message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
//   }

//   res.locals.errorMessage = err.message;

//   const response = {
//     code: statusCode,
//     message,
//     errors: err.errors,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
//   };

//   if (process.env.NODE_ENV === 'development') {
//     logger.error(err);
//   }

//   res.status(statusCode).send(response);
// };

// module.exports = {
//   errorHandler,
// };
