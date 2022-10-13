const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const crypto = require('crypto');

// Protect routes
exports.zohoWebhook = asyncHandler(async (req, res, next) => {
  let signatureHash = req.headers['x-zoho-webhook-signature'];
  let payload = req.rawBody;

  if (!payload) {
    return next(new ErrorResponse('Payload Empty', 204));
  }

  // * encrypt payload with local secret key
  let computedHash = crypto
    .createHmac('sha256', process.env.ZOHO_WEBHOOK_KEY)
    .update(payload, 'utf8')
    .digest('hex');

  // * check if computedHash is same as zoho generated signatureHash
  if (
    signatureHash.length === computedHash.length &&
    crypto.timingSafeEqual(
      Buffer.from(signatureHash),
      Buffer.from(computedHash)
    )
  ) {
    //console.log('Zoho automation signatureHash match OK');
    next();
  } else {
    return next(new ErrorResponse('Signature mismatch', 401));
  }
});
