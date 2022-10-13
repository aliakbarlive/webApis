const { Op } = require('sequelize');
const { pick, keys } = require('lodash');
const {
  Product,
  Listing,
  CategoryRanking,
  CategoryRankingRecord,
} = require('../models');

/**
 * Get categories by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getCategoriesByAccountId = async (accountId, query) => {
  const { filter, pageSize, pageOffset, sort, include } = query;

  let options = {
    where: {},
    include: [
      {
        model: Listing,
        as: 'listing',
        attributes: ['title', 'asin', 'thumbnail'],
        required: true,
        where: pick(filter, keys(Listing.rawAttributes)),
        include: {
          model: Product,
          required: true,
          as: 'product',
          attributes: [],
          where: { accountId },
        },
      },
    ],
    order: sort,
    limit: pageSize,
    offset: pageOffset,
  };

  if (include === 'records') {
    options.include.push({
      model: CategoryRankingRecord,
      as: 'records',
    });
  }

  if (query.search) {
    options.where.category = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  const categories = await CategoryRanking.findAndCountAll(options);

  return categories;
};

/**
 * Get category by accountId and categoryId
 *
 * @param uuid accountId
 * @param int categoryId
 * @param object query
 * @returns CategoryRanking
 */
const getCategoriesByAccountIdAndId = async (accountId, categoryId, query) => {
  const { marketplaceId, include } = query;

  let options = {
    where: {
      categoryRankingId: categoryId,
    },
    include: [
      {
        model: Listing,
        as: 'listing',
        attributes: [],
        required: true,
        where: { marketplaceId },
        include: {
          model: Product,
          required: true,
          as: 'product',
          attributes: [],
          where: { accountId },
        },
      },
    ],
  };

  if (include === 'records') {
    options.include.push({
      model: CategoryRankingRecord,
      as: 'records',
    });
  }

  const category = await CategoryRanking.findOne(options);

  return category;
};

module.exports = {
  getCategoriesByAccountId,
  getCategoriesByAccountIdAndId,
};
