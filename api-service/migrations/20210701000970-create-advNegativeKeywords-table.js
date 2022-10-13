'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advNegativeKeywords', {
      advNegativeKeywordId: {
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
      matchType: {
        type: Sequelize.ENUM('negativeExact', 'negativePhrase'),
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
    await queryInterface.dropTable('advNegativeKeywords');
  },
};
