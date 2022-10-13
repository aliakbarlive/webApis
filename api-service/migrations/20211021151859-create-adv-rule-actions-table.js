'use strict';

const { snakeCase } = require('lodash');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advRuleActions', {
      advRuleActionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      campaignType: {
        type: Sequelize.ENUM(
          'sponsoredProducts',
          'sponsoredBrands',
          'sponsoredDisplay'
        ),
        allowNull: false,
      },
      recordType: {
        type: Sequelize.ENUM(
          'campaigns',
          'adGroups',
          'keywords',
          'targets',
          'productAds',
          'searchTerms'
        ),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    const campaignType = 'sponsoredProducts';

    const actions = [
      ...['campaigns', 'adGroups', 'keywords', 'targets'].map((recordType) => {
        return {
          campaignType,
          recordType,
          name: 'Update Status',
          code: `SP:${snakeCase(recordType).toUpperCase()}:UPDATE_STATUS`,
        };
      }),
      {
        campaignType,
        recordType: 'campaigns',
        name: 'Update Daily Budget',
        code: 'SP:CAMPAIGNS:UPDATE_DAILY_BUDGET',
      },
      {
        campaignType,
        recordType: 'adGroups',
        name: 'Update Default Bid',
        code: 'SP:AD_GROUPS:UPDATE_DEFAULT_BID',
      },
      {
        campaignType,
        recordType: 'keywords',
        name: 'Update Bid',
        code: 'SP:KEYWORDS:UPDATE_BID',
      },
      {
        campaignType,
        recordType: 'targets',
        name: 'Update Bid',
        code: 'SP:TARGETS:UPDATE_BID',
      },
      {
        campaignType,
        recordType: 'searchTerms',
        name: 'Convert as negative keyword',
        code: 'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD',
      },
      {
        campaignType,
        recordType: 'searchTerms',
        name: 'Convert as keyword on existing campaign & Ad group',
        code: 'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP',
      },
      {
        campaignType,
        recordType: 'searchTerms',
        name: 'Convert as keyword on new campaign & Ad group',
        code: 'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP',
      },
    ];

    queryInterface.bulkInsert('advRuleActions', actions);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advRuleActions');
  },
};
