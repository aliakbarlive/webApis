const moment = require('moment');
const { pick } = require('lodash');
const { Op } = require('sequelize');

const {
  advPortfolioAttributes,
  bulkCreateAdvPorfolio,
  findAndCountAllAdvPortfolio,
} = require('../repositories/advPorfolio.repository');

const cache = require('../utils/cache');

const getAdvPorfolios = async (advProfile, query) => {
  const { pageSize, pageOffset, sort, search, filter } = query;

  let options = {
    where: {
      advProfileId: advProfile.advProfileId,
      ...pick(filter, advPortfolioAttributes),
    },
    limit: pageSize,
    offset: pageOffset,
    order: sort,
  };

  if (search) {
    options.where.name = {
      [Op.iLike]: `%${search}%`,
    };
  }

  const syncOptions =
    'state' in filter ? { portfolioStateFilter: filter.state } : {};

  const cacheKey = `${advProfile.advProfileId}-portfolios-last-sync`;
  const previousSyncDate = await cache.get(cacheKey);

  const requiresSync = previousSyncDate
    ? moment().isAfter(moment(previousSyncDate).add(1, 'hour'))
    : true;

  if (requiresSync) {
    await syncAdvPortfolios(advProfile, syncOptions);
    await cache.set(cacheKey, moment().add(1, 'hour').format());
  }

  const { rows, count } = await findAndCountAllAdvPortfolio(options);

  return { rows, count };
};

const syncAdvPortfolios = async (advProfile, options = {}) => {
  const apiClient = await advProfile.apiClient();
  let portfolios = await apiClient.listPortfolios(options, true);

  portfolios = portfolios.map((portfolio) => {
    portfolio.advPortfolioId = portfolio.portfolioId;
    portfolio.advProfileId = advProfile.advProfileId;
    portfolio.createdAt = new Date(portfolio.creationDate);
    portfolio.updatedAt = new Date(portfolio.lastUpdatedDate);
    return portfolio;
  });

  if (portfolios.length) {
    await bulkCreateAdvPorfolio(portfolios, {
      updateOnDuplicate: [
        'name',
        'budget',
        'inBudget',
        'state',
        'servingStatus',
        'createdAt',
        'updatedAt',
      ],
    });
  }
};

module.exports = {
  getAdvPorfolios,
};
