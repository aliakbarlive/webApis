const { Op, literal } = require('sequelize');
const { pick, keys } = require('lodash');
const { Review, Listing, Product, Note, SpReport } = require('../models');

/**
 * Get Reviews by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getReviewsByAccountId = async (accountId, query) => {
  const { filter, pageSize, pageOffset, sort, dateRange } = query;

  let options = {
    attributes: {
      include: [
        [
          literal(
            `(SELECT COUNT("noteId") FROM notes WHERE notes."reviewId" = "Review"."reviewId")`
          ),
          'notesCount',
        ],
      ],
    },
    where: {
      reviewDate: {
        [Op.between]: [dateRange.startDate, dateRange.endDate],
      },
      ...pick(filter, keys(Review.rawAttributes)),
    },
    include: {
      model: Listing,
      where: pick(filter, keys(Listing.rawAttributes)),
      attributes: ['asin', 'title', 'thumbnail'],
      include: [
        {
          model: Product,
          as: 'product',
          required: true,
          attributes: [],
          where: { accountId },
        },
      ],
    },
    order: sort,
    limit: pageSize,
    offset: pageOffset,
  };

  if (query.search) {
    options.where[Op.or] = {
      [Op.or]: ['title', 'body'].map((attribute) => {
        return {
          [attribute]: {
            [Op.iLike]: `%${query.search}%`,
          },
        };
      }),
    };
  }

  if ('withNotes' in filter) {
    const operator = filter.withNotes ? '>' : '=';

    options.where[Op.and] = {
      [Op.and]: [
        literal(
          `(SELECT COUNT(*) FROM notes WHERE notes."reviewId" = "Review"."reviewId") ${operator} 0`
        ),
      ],
    };
  }

  const { count, rows } = await Review.findAndCountAll(options);

  return { count, rows };
};

/**
 * Get Review by accountId and reviewId.
 *
 * @param uuid accountId
 * @param string reviewId
 * @returns Review
 */
const getReviewByAccountIdAndReviewId = async (accountId, reviewId, query) => {
  const review = await Review.findOne({
    where: {
      reviewId,
    },
    include: [
      {
        model: Note,
      },
      {
        model: Listing,
        where: pick(query, keys(Listing.rawAttributes)),
        attributes: [],
        include: [
          {
            model: Product,
            as: 'product',
            required: true,
            attributes: [],
            where: { accountId },
          },
        ],
      },
    ],
  });

  return review;
};

/**
 * Add Job to save reviews via queue.
 *
 * @param object body
 */
const addJobToSaveReviewsQueue = async (body) => {
  const { download_links } = body.result_set;
  const { id: reportId } = body.collection;

  try {
    if (body.request_info.success) {
      const spReport = await SpReport.findOne({ where: { reportId } });

      const saveReviewsQueue = require('../queues/reviews/save');

      const accountId = body.collection.name.replace('-reviews', '');
      const { pages } = download_links.json;

      const job = await saveReviewsQueue.add({
        pages,
        accountId,
        reportId,
        spReportId: spReport.spReportId,
      });

      await spReport.update({ jobId: job.id });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getReviewsByAccountId,
  addJobToSaveReviewsQueue,
  getReviewByAccountIdAndReviewId,
};
