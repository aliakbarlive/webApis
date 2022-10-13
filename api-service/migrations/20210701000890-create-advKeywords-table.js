'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advKeywords', {
      advKeywordId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      keywordText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bid: {
        type: Sequelize.DECIMAL,
      },
      matchType: {
        type: Sequelize.ENUM('exact', 'phrase', 'broad'),
      },
      state: {
        type: Sequelize.ENUM('enabled', 'paused', 'archived'),
      },
      servingStatus: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advKeywords');
  },
};
