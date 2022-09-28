const searchTermRoute = require('./searchTerm.route');
const searchTermService = require('./searchTerm.service');
const searchTermValidation = require('./searchTerm.validation');
const searchTermController = require('./searchTerm.controller');
const SearchTermRepository = require('./searchTerm.repository');

module.exports = {
  searchTermRoute,
  searchTermService,
  searchTermValidation,
  searchTermController,
  SearchTermRepository,
};
