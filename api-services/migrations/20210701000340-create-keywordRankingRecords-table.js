'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('keywordRankingRecords', {
      keywordRankingsId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      keywordId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'keywordRankings',
            schema: 'public',
          },
          key: 'keywordId',
        },
      },
      asin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalRecords: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_pages: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rankings: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      current_page: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('keywordRankingRecords');
  },
};
