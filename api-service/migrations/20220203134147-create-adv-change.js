'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advChanges', {
      advChangeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      advChangeCollectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'advChangeCollectionId',
          model: { tableName: 'advChangeCollections', schema: 'public' },
        },
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advCampaignId',
          model: { tableName: 'advCampaigns', schema: 'public' },
        },
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advAdGroupId',
          model: { tableName: 'advAdGroups', schema: 'public' },
        },
      },
      advKeywordId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advKeywordId',
          model: { tableName: 'advKeywords', schema: 'public' },
        },
      },
      advTargetId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advTargetId',
          model: { tableName: 'advTargets', schema: 'public' },
        },
      },
      advProductAdId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advProductAdId',
          model: { tableName: 'advProductAds', schema: 'public' },
        },
      },
      advNegativeKeywordId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advNegativeKeywordId',
          model: { tableName: 'advNegativeKeywords', schema: 'public' },
        },
      },
      advNegativeTargetId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advNegativeTargetId',
          model: { tableName: 'advNegativeTargets', schema: 'public' },
        },
      },
      advCampaignNegativeKeywordId: {
        type: Sequelize.BIGINT,
        references: {
          key: 'advCampaignNegativeKeywordId',
          model: { tableName: 'advCampaignNegativeKeywords', schema: 'public' },
        },
      },
      recordType: {
        type: Sequelize.ENUM(
          'campaign',
          'adGroup',
          'keyword',
          'target',
          'productAd',
          'negativeKeyword',
          'negativeTarget',
          'campaignNegativeKeyword'
        ),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      hasSystemDiff: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      previousData: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      newData: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      activityDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      advOptimizationId: {
        type: Sequelize.INTEGER,
        references: {
          key: 'advOptimizationId',
          model: { tableName: 'advOptimizations', schema: 'public' },
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advChanges');
  },
};
