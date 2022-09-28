const NegativeKeywordRepository = require('./negativeKeyword.repository');
const negativeKeywordController = require('./negativeKeyword.controller');
const negativeKeywordService = require('./negativeKeyword.service');
const negativeKeywordRoute = require('./negativeKeyword.route');

module.exports = {
  negativeKeywordRoute,
  negativeKeywordService,
  negativeKeywordController,
  NegativeKeywordRepository,
};
