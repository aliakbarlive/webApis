'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advOptimizationReportItems', {
      advOptimizationReportItemId: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      advOptimizationReportId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: { tableName: 'advOptimizationReports', schema: 'public' },
          key: 'advOptimizationReportId',
        },
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advCampaigns', schema: 'public' },
          key: 'advCampaignId',
        },
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advAdGroups', schema: 'public' },
          key: 'advAdGroupId',
        },
      },
      advProductAdId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advProductAds', schema: 'public' },
          key: 'advProductAdId',
        },
      },
      advTargetId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advTargets', schema: 'public' },
          key: 'advTargetId',
        },
      },
      advKeywordId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advKeywords', schema: 'public' },
          key: 'advKeywordId',
        },
      },
      advSearchTermId: {
        type: Sequelize.BIGINT,
        references: {
          model: { tableName: 'advSearchTerms', schema: 'public' },
          key: 'advSearchTermId',
        },
      },
      values: {
        type: Sequelize.JSONB,
      },
      previousData: {
        type: Sequelize.JSONB,
      },
      previousDataDateRange: {
        type: Sequelize.JSONB,
      },
      acos: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      cpc: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      cr: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      ctr: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      profit: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      impressions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedConversions1d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions7d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions30d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions1dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions7dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions14dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedConversions30dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered1d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered7d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered30d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedSales1d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales7d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales30d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales1dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales7dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales14dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSales30dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedUnitsOrdered1dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered7dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered14dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered30dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedDPV14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsSold14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedDetailPageViewsClicks14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedOrdersNewToBrand14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedOrdersNewToBrandPercentage14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedOrderRateNewToBrand14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedSalesNewToBrand14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedSalesNewToBrandPercentage14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      attributedUnitsOrderedNewToBrand14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrderedNewToBrandPercentage14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      unitsSold14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      dpv14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advOptimizationReportItems');
  },
};
