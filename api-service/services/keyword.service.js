const { Op, literal } = require('sequelize');
const { pick, keys, camelCase } = require('lodash');
const { KeywordRanking, Listing, KeywordRankingRecord } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

const recordsAttributes = [
  'totalRecords',
  'rankings',
  'currentPage',
  'position',
  'updatedAt',
];

/**
 * Get keywords by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getKeywordsByAccountId = async (accountId, query) => {
  const { filter, pageSize, pageOffset, sort, scope, include } = query;

  const options = {
    where: { accountId },
    include: [
      {
        model: Listing,
        as: 'listing',
        where: pick(filter, keys(Listing.rawAttributes)),
        required: true,
        attributes: ['title', 'asin', 'thumbnail'],
      },
    ],
    subQuery: false,
    limit: pageSize,
    offset: pageOffset,
    order: sort,
    group: ['KeywordRanking.keywordId', 'listing.listingId'],
  };

  if (query.search) {
    options.where.keywordText = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  if (scope || include) {
    const { customAttributes, customSort } = transformAttributesQuery(query);
    const { additionalGroupKey, includeRecords } = transformIncludeQuery(query);

    if (customAttributes) options.attributes = customAttributes;
    if (customSort) options.order = customSort;
    if (additionalGroupKey) options.group.push(additionalGroupKey);

    options.include.push(includeRecords);
  }

  const { rows, count } = await KeywordRanking.findAndCountAll(options);

  return { count: count.length, rows };
};

/**
 * Convert custom attribute to query.
 *
 * @param string attribute
 * @param date startDate
 * @param date endDate
 * @returns literal
 */
const attributeToQuery = (attribute, startDate, endDate) => {
  return literal(
    `(SELECT "${attribute}" FROM "keywordRankingRecords" 
            WHERE "KeywordRanking"."keywordId" = "keywordRankingRecords"."keywordId" 
            AND "keywordRankingRecords"."createdAt" BETWEEN '${startDate}' AND '${endDate}'
            ORDER BY "keywordRankingRecords"."createdAt" DESC LIMIT 1)`
  );
};

/**
 * Transform attributes query.
 *
 * @param object query
 * @returns object
 */
const transformAttributesQuery = ({ dateRange, scope, sort }) => {
  let customAttributes = null;
  let customSort = null;

  if (scope) {
    const { startDate, endDate } = dateRange;

    customAttributes = {
      include: recordsAttributes.map((attr) => [
        attributeToQuery(attr, startDate, endDate),
        attr,
      ]),
      exclude: ['listingId', 'accountId', 'updatedAt'],
    };

    customSort = sort.map((order) => {
      if (recordsAttributes.includes(order[0]))
        order[0] = attributeToQuery(order[0], startDate, endDate);

      return order;
    });
  }

  return { customAttributes, customSort };
};

/**
 * Transform include query.
 *
 * @param object query
 * @returns object
 */
const transformIncludeQuery = ({ include, dateRange }) => {
  const { startDate, endDate } = dateRange;
  const additionalGroupKey = include ? 'records.keywordRankingId' : '';
  const attributes = include
    ? [
        'totalRecords',
        'currentPage',
        'totalPages',
        'rankings',
        'position',
        'createdAt',
      ]
    : [];

  const includeRecords = {
    model: KeywordRankingRecord,
    as: 'records',
    attributes,
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    required: true,
  };

  return { additionalGroupKey, includeRecords };
};

const getKeywordByAccountIdAndId = async (accountId, keywordId, query) => {
  const { filter, dateRange, include } = query;

  const options = {
    where: { accountId, keywordId },
    include: [
      {
        model: Listing,
        as: 'listing',
        where: pick(filter, keys(Listing.rawAttributes)),
        required: true,
        attributes: [],
      },
    ],
  };

  if (include === 'records') {
    const { startDate, endDate } = dateRange;

    options.include.push({
      model: KeywordRankingRecord,
      required: true,
      as: 'records',
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }

  const keyword = await KeywordRanking.findOne(options);

  return keyword;
};

/**
 * Update Keyword details.
 *
 * @param KeywordRanking keyword
 * @param object data
 * @returns KeywordRanking
 */
const updateKeywordDetails = async (keyword, data) => {
  await keyword.update(data);

  return keyword;
};

/**
 * Add Keyword to a listing.
 *
 * @param Listing listing
 * @param object data
 * @returns KeywordRanking
 */
const addKeywordToListing = async (listing, data) => {
  const { listingId } = listing;
  const { accountId, keywordText } = data;

  const exists = await KeywordRanking.count({
    where: {
      listingId,
      accountId,
      keywordText,
    },
  });

  if (exists) {
    throw new ErrorResponse('Keyword already exists.', 400);
  }

  const keyword = await KeywordRanking.create({
    listingId,
    accountId,
    keywordText,
    status: 'active',
  });

  return keyword;
};

/**
 * Search keywords by accountId.
 *
 * @param uuid accountId
 * @param object data
 */
const searchKeywordsByAccountId = async (accountId, data) => {
  const requestKeywordsQueue = require('../queues/keywords/request');
  let keywords = null;

  if ('keywords' in data) {
    keywords = data.keywords.map((keyword) => {
      keyword.marketplaceId = data.marketplaceId;
      return keyword;
    });
  }

  await requestKeywordsQueue.add({ accountId, keywords });
};

module.exports = {
  addKeywordToListing,
  updateKeywordDetails,
  getKeywordsByAccountId,
  getKeywordByAccountIdAndId,
  searchKeywordsByAccountId,
};
