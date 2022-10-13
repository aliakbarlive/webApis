'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advRuleActions',
          'validation',
          {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: {},
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advRuleActions',
          {
            validation: JSON.stringify({
              dailyBudget: 'required|numeric|min:1',
            }),
          },
          {
            code: 'SP:CAMPAIGNS:UPDATE_DAILY_BUDGET',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advRuleActions',
          {
            validation: JSON.stringify({
              defaultBid: 'required|numeric|min:0.02',
            }),
          },
          {
            code: 'SP:AD_GROUPS:UPDATE_DEFAULT_BID',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advRuleActions',
          {
            validation: JSON.stringify({
              bid: 'required|numeric|min:0.02',
            }),
          },
          {
            code: 'SP:KEYWORDS:UPDATE_BID',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advRuleActions',
          {
            validation: JSON.stringify({
              bid: 'required|numeric|min:0.02',
            }),
          },
          {
            code: 'SP:TARGETS:UPDATE_BID',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advRuleActions',
          {
            validation: JSON.stringify({
              adGroupId: 'required|numeric',
              campaignId: 'required|numeric',
              matchType: 'required|in:exact,phrase,broad',
              bid: 'required|numeric|min:0.02',
            }),
          },
          {
            code: 'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advRuleActions',
          {
            validation: JSON.stringify({
              convertAsNegativeKeywordOn: 'in:campaigns,adGroups',
              'campaign.name': 'required',
              'campaign.portfolioId': 'numeric',
              'campaign.campaignType': 'required|in:sponsoredProducts',
              'campaign.targetingType': 'required|in:manual',
              'campaign.state': 'required|in:enabled',
              'campaign.dailyBudget': 'required|numeric|min:1',
              'campaign.startDate': 'required|date|after_or_equal:now',
              'campaign.endDate': 'date|after_or_equal:startDate',
              'campaign.bidding.strategy': 'required|in:legacyForSales',
              'campaign.bidding.adjustments': 'required|array',
              'campaign.bidding.adjustments.*.predicate':
                'required|in:placementTop,placementProductPage',
              'campaign.bidding.adjustments.*.percentage':
                'required|numeric|min:0',
              'adGroup.name': 'required',
              'adGroup.defaultBid': 'required|numeric|min:0.02',
              'adGroup.state': 'required|in:enabled',
              productAds: 'required|array',
              'productAds.*.sku': 'required',
              negativeKeywords: 'required|array',
              'negativeKeywords.*.keywordText': 'required',
              'negativeKeywords.*.matchType':
                'required|in:negativeExact,negativePhrase',
              'negativeKeywords.*.state': 'required|in:enabled',
              keywords: 'required|array',
              'keywords.*.state': 'required|in:enabled',
              'keywords.*.keywordText': 'required',
              'keywords.*.bid': 'required|numeric|min:0.02',
            }),
          },
          {
            code: 'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP',
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('advRuleActions', 'validation');
  },
};
