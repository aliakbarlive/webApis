const KeywordRepository = require('./keyword.repository');
const KeywordRecordRepository = require('./keywordRecord.repository');
const keywordService = require('./keyword.service');
const keywordRoute = require('./keyword.route');

module.exports = {
  KeywordRepository,
  keywordService,
  keywordRoute,
  KeywordRecordRepository,
};
