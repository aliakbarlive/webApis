const express = require('express');
const router = express.Router();

const {
  getTags,
  addTag,
  updateTag,
  deleteTag,
  deleteTagRecord,
} = require('../../controllers/client/tag');

const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');
const { paginate, withFilters } = require('../../middleware/advancedList');

const {
  getTagsRequest,
  addTagRequest,
  updateTagRequest,
  deleteTagRecordRequest,
  deleteTagRequest,
} = require('../../validations/tag.validation');

router.get(
  '/',
  validate(getTagsRequest),
  protect,
  account,
  marketplace,
  paginate,
  withFilters,
  getTags
);

router.post(
  '/',
  validate(addTagRequest),
  protect,
  account,
  marketplace,
  addTag
);
router.put(
  '/:tagId',
  validate(updateTagRequest),
  protect,
  account,
  marketplace,
  updateTag
);

router.delete(
  '/:tagId/records',
  validate(deleteTagRecordRequest),
  protect,
  account,
  marketplace,
  deleteTagRecord
);

router.delete(
  '/:tagId',
  validate(deleteTagRequest),
  protect,
  account,
  marketplace,
  deleteTag
);

module.exports = router;
