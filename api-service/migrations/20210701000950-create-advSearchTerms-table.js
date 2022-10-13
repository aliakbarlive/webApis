'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advSearchTerms', {
      advSearchTermId: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      advTargetId: {
        type: Sequelize.BIGINT,
      },
      advKeywordId: {
        type: Sequelize.BIGINT,
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advSearchTerms');
  },
};
