const { pick, keys } = require('lodash');
const { Tag, TagRecord } = require('../models');

/**
 * Get tags by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getTagsByAccountId = async (accountId, query) => {
  const { filter, pageSize: limit, pageOffset: offset, sort } = query;

  const tags = await Tag.findAndCountAll({
    where: {
      accountId,
      ...pick(filter, keys(Tag.rawAttributes)),
    },
    limit,
    offset,
    order: sort,
  });

  return tags;
};

/**
 * Get tag by accountId and tagId.
 *
 * @param uuid accountId
 * @param int tagId
 * @param object filter
 * @returns Tag
 */
const getTagByAccountIdAndTagId = async (accountId, tagId, filter) => {
  const tag = await Tag.findOne({
    where: {
      accountId,
      tagId,
      ...pick(filter, keys(Tag.rawAttributes)),
    },
  });

  return tag;
};

/**
 * Add tag to accountId.
 *
 * @param uuid accountId
 * @param object data
 * @returns Tag
 */
const addTagToAccountId = async (accountId, data) => {
  const [tag] = await Tag.findOrCreate({
    where: {
      accountId,
      ...pick(data, keys(Tag.rawAttributes)),
    },
  });

  data.tagId = tag.tagId;

  await TagRecord.findOrCreate({
    where: pick(data, keys(TagRecord.rawAttributes)),
  });

  return tag;
};

/**
 * Update tags by accountId and tagId
 *
 * @param uuid accountId
 * @param int tagId
 * @param object data
 * @returns boolean
 */
const updateTagByAccountIdAndTagId = async (accountId, tagId, data) => {
  const { name, marketplaceId } = data;

  const [count] = await Tag.update(
    { name },
    {
      where: { accountId, tagId, marketplaceId },
    }
  );

  return !!count;
};

/**
 * Delete tag by accountId and tagId
 *
 * @param uuid accountId
 * @param int tagId
 * @param object data
 * @returns boolean
 */
const deleteTagByAccountIdAndTagId = async (accountId, tagId, filter = {}) => {
  TagRecord.destroy({ where: { tagId } });

  const deletedCount = await Tag.destroy({
    where: { accountId, tagId, ...pick(filter, keys(Tag.rawAttributes)) },
  });

  return !!deletedCount;
};

/**
 * Delete tag record by tagId
 *
 * @param int tagId
 * @param object data
 * @returns boolean
 */
const deleteTagRecordByTagId = async (tagId, data) => {
  const deletedCount = await TagRecord.destroy({
    where: { tagId, ...pick(data, keys(TagRecord.rawAttributes)) },
  });

  return !!deletedCount;
};

module.exports = {
  getTagsByAccountId,
  addTagToAccountId,
  deleteTagRecordByTagId,
  getTagByAccountIdAndTagId,
  updateTagByAccountIdAndTagId,
  deleteTagByAccountIdAndTagId,
};
