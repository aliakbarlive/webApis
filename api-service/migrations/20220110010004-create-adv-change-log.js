'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advChangeLogs', {
      advChangeLogId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      advProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
      },
      advProductAdId: {
        type: Sequelize.BIGINT,
      },
      advKeywordId: {
        type: Sequelize.BIGINT,
      },
      advTargetId: {
        type: Sequelize.BIGINT,
      },
      advCampaignNegativeKeywordId: {
        type: Sequelize.BIGINT,
      },
      advNegativeKeywordId: {
        type: Sequelize.BIGINT,
      },
      advNegativeTargetId: {
        type: Sequelize.BIGINT,
      },
      recordType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      previousData: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      newData: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      advOptimizationId: {
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
    await queryInterface.dropTable('advChangeLogs');
  },
};
