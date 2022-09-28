'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn(
          'keywordRankingRecords',
          'keywordRankingsId',
          'keywordRankingId',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'keywordRankingRecords',
          'total_pages',
          'totalPages',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'keywordRankingRecords',
          'current_page',
          'currentPage',
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn(
          'keywordRankingRecords',
          'keywordRankingId',
          'keywordRankingsId',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'keywordRankingRecords',
          'totalPages',
          'total_pages',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'keywordRankingRecords',
          'currentPage',
          'current_page',
          { transaction: t }
        ),
      ]);
    });
  },
};
