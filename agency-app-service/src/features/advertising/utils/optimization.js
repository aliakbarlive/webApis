import {
  INCREASE_BY,
  VALUE,
  DECREASE_BY,
  SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD,
  SP_KEYWORDS_UPDATE_BID,
  AD_GROUPS,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP,
  ENABLED_STATUS,
  EXACT,
  BROAD,
  PHRASE,
  SP_CAMPAIGNS_UPDATE_BUDGET,
} from './constants';

export const optimizeAllocation = (allocation, optimization) => {
  let { type, by, value } = optimization;
  value = parseFloat(value);

  switch (type) {
    case INCREASE_BY:
      allocation =
        by === VALUE ? allocation + value : allocation * (1 + value / 100);
      break;
    case DECREASE_BY:
      allocation =
        by === VALUE ? allocation - value : allocation * (1 - value / 100);
      break;
    default:
      allocation = value;
      break;
  }

  return allocation;
};

export const optimizeBid = (currentBid, options) => {
  let newBid = parseFloat(currentBid);
  switch (options.type) {
    case INCREASE_BY:
      newBid =
        options.value.type === VALUE
          ? newBid + options.value.value
          : newBid * (1 + options.value.value / 100);
      break;
    case DECREASE_BY:
      newBid =
        options.value.type === VALUE
          ? newBid - options.value.value
          : newBid * (1 - options.value.value / 100);
      break;
    default:
      newBid = options.value;
      break;
  }

  return Math.round(newBid * 100) / 100;
};

export const optimize = (action, options, row) => {
  let data = {};
  switch (action.code) {
    case SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD:
      data = {
        keywordText: row.query,
        matchType: options.matchType,
        campaignId: row.advCampaignId,
        state: ENABLED_STATUS,
      };

      if (options.level === AD_GROUPS)
        data = { ...data, adGroupId: row.advAdGroupId };
      break;
    case SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP:
      data = {
        keywordText: row.query,
        matchType: '',
        campaignId: '',
        adGroupId: '',
        bid: '',
        state: ENABLED_STATUS,
      };

      if (row.target === 'keyword') {
        data.campaignId = row.advCampaignId;
        data.adGroupId = row.advAdGroupId;
        data.bid = row.AdvAdGroup.defaultBid;
      }
      break;
    case SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP:
      data = {
        convertAsNegativeKeywordOn: '',
        campaign: {
          portfolioId: '',
          name: '',
          campaignType: 'sponsoredProducts',
          targetingType: 'manual',
          state: ENABLED_STATUS,
          dailyBudget: '',
          startDate: '',
          endDate: '',
          bidding: {
            strategy: 'legacyForSales', // autoForSales, manual
            adjustments: [
              { predicate: 'placementTop', percentage: 0 },
              { predicate: 'placementProductPage', percentage: 0 },
            ],
          },
        },
        adGroup: {
          name: '',
          defaultBid: '',
          state: ENABLED_STATUS,
        },
        targeting: 'keywords',
        productAds: row.AdvAdGroup.AdvProductAds,
        negativeKeywords: [],
        keywords: [
          {
            state: ENABLED_STATUS,
            keywordText: row.query,
            matchType: EXACT,
            bid: row.cpc,
          },
          {
            state: ENABLED_STATUS,
            keywordText: row.query,
            matchType: BROAD,
            bid: row.cpc,
          },
          {
            state: ENABLED_STATUS,
            keywordText: row.query,
            matchType: PHRASE,
            bid: row.cpc,
          },
        ],
      };
      break;
    case SP_KEYWORDS_UPDATE_BID:
      data = { bid: optimizeBid(row.bid, options) };
      break;
    case SP_CAMPAIGNS_UPDATE_BUDGET:
      data = { dailyBudget: optimizeBid(row.dailyBudget, options) };
      break;
    default:
      data = options;
      break;
  }

  return data;
};
