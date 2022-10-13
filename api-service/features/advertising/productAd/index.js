const productAdRoute = require('./productAd.route');
const productAdService = require('./productAd.service');
const productAdValidation = require('./productAd.validation');
const productAdController = require('./productAd.controller');
const ProductAdRepository = require('./productAd.repository');

module.exports = {
  productAdRoute,
  productAdService,
  productAdValidation,
  productAdController,
  ProductAdRepository,
};
