const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
  requiresDateRange,
} = require('./base.validation');

const getReviewsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    withNotes: Joi.boolean(),
    asin: Joi.string(),
    rating: Joi.string().custom((value, helpers) => {
      const allowed = [1, 2, 3, 4, 5];

      const isValid = value
        .split(',')
        .every((attribute) => allowed.includes(parseInt(attribute)));

      if (!isValid) {
        throw new Error('Invalid rating.');
      }

      return value;
    }),
  }),
};

const getReviewRequest = {
  params: Joi.object().keys({
    reviewId: Joi.string().required(),
  }),
  query: Joi.object().keys(requiresAccountAndMarketplace),
};

module.exports = {
  getReviewsRequest,
  getReviewRequest,
};
