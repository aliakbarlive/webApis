const { Op } = require('sequelize');
const { pick, keys } = require('lodash');
const { Listing, Product } = require('../models');

/**
 * Get listings associated to accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getListingsByAccountId = async (accountId, query) => {
  let { filter, pageSize: limit, pageOffset: offset, sort } = query;

  let options = {
    include: [
      {
        model: Product,
        as: 'product',
        attributes: [],
        where: { accountId },
      },
    ],
    where: pick(filter, keys(Listing.rawAttributes)),
    attributes: [
      'listingId',
      'asin',
      'groupedAsin',
      'title',
      'link',
      'brand',
      'status',
      'thumbnail',
    ],
    order: sort,
    limit,
    offset,
  };

  if (query.search) {
    options.where[Op.and] = {
      [Op.or]: ['title', 'asin'].map((key) => {
        return {
          [key]: {
            [Op.iLike]: `%${query.search}%`,
          },
        };
      }),
    };
  }

  const listings = await Listing.findAndCountAll(options);

  return listings;
};

/**
 * Get listing by accountId and asin.
 *
 * @param uuid accountId
 * @param string asin
 * @param filter query
 * @returns Listing
 */
const getListingByAccountIdAndAsin = async (accountId, asin, filter) => {
  const listing = await Listing.findOne({
    include: [
      {
        model: Product,
        as: 'product',
        attributes: [],
        where: { accountId },
      },
    ],
    where: {
      asin,
      ...pick(filter, keys(Listing.rawAttributes)),
    },
  });

  return listing;
};

module.exports = { getListingsByAccountId, getListingByAccountIdAndAsin };
