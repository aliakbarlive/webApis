'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advAdGroupRecords', {
      advAdGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        primaryKey: true,
      },
      advReportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advReports',
            schema: 'public',
          },
          key: 'advReportId',
        },
      },
      impressions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions1d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions7d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions30d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions1dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions7dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions14dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions30dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered1d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered7d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered30d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales1d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales7d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales30d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales1dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales7dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales14dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales30dSameSKU: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered1dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered7dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered14dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered30dSameSKU: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedDPV14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsSold14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedDetailPageViewsClicks14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedOrdersNewToBrand14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedOrdersNewToBrandPercentage14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedOrderRateNewToBrand14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSalesNewToBrand14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSalesNewToBrandPercentage14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrderedNewToBrand14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrderedNewToBrandPercentage14d: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      unitsSold14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      dpv14d: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advAdGroupRecords');
  },
};
