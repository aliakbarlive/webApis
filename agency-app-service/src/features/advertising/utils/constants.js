export const SPONSORED_PRODUCTS = 'sponsoredProducts';
export const SPONSORED_BRANDS = 'sponsoredBrands';
export const SPONSORED_DISPLAY = 'sponsoredDisplay';

export const CAMPAIGNS = 'campaigns';
export const AD_GROUPS = 'adGroups';
export const KEYWORDS = 'keywords';
export const TARGETS = 'targets';
export const PRODUCT_ADS = 'productAds';
export const SEARCH_TERMS = 'searchTerms';

export const DEFAULT_TARGETING = '';
export const PRODUCT_TARGETING = 'product';
export const KEYWORD_TARGETING = 'keyword';

export const ENABLED_STATUS = 'enabled';
export const PAUSED_STATUS = 'paused';
export const ARCHIVED_STATUS = 'archived';

export const STATUS_OPTIONS = [ENABLED_STATUS, PAUSED_STATUS, ARCHIVED_STATUS];

export const NEGATIVE_EXACT = 'negativeExact';
export const NEGATIVE_PHRASE = 'negativePhrase';

export const NEGATIVE_MATCH_TYPES = [NEGATIVE_EXACT, NEGATIVE_PHRASE];

export const BROAD = 'broad';
export const EXACT = 'exact';
export const PHRASE = 'phrase';

export const MATCH_TYPES = [BROAD, PHRASE, EXACT];

export const AUTO_TARGETING = 'auto';
export const MANUAL_TARGETING = 'manual';

export const SPONSORED_PRODUCT_CUSTOM_ATTRIBUTES = {
  sales: 'attributedSales30d',
  orders: 'attributedUnitsOrdered30d',
  budget: 'dailyBudget',
  subPath: 'products',
};

export const SPONSORED_BRANDS_CUSTOM_ATTRIBUTES = {
  sales: 'attributedSales14d',
  orders: 'unitsSold14d',
  budget: 'budget',
  subPath: 'brands',
};

export const SPONSORED_DISPLAY_CUSTOM_ATTRIBUTES = {
  sales: 'attributedSales30d',
  orders: 'attributedUnitsOrdered30d',
  budget: 'budget',
  subPath: 'display',
};

export const CUSTOM_ATTRIBUTES = {
  [SPONSORED_PRODUCTS]: SPONSORED_PRODUCT_CUSTOM_ATTRIBUTES,
  [SPONSORED_BRANDS]: SPONSORED_BRANDS_CUSTOM_ATTRIBUTES,
  [SPONSORED_DISPLAY]: SPONSORED_DISPLAY_CUSTOM_ATTRIBUTES,
};

export const BASE_ATTRIBUTES = {
  [KEYWORDS]:
    'advKeywordId,advAdGroupId,keywordText,matchType,state,bid,bidUpdatedAtInDays',
  [SEARCH_TERMS]:
    'advSearchTermId,advAdGroupId,advCampaignId,query,target,convertedAsNegativeKeyword,convertedAsCampaignNegativeKeyword',
  [CAMPAIGNS]: 'advCampaignId,name,targetingType,dailyBudget,budget,state',
};

export const KEY_FIELDS = {
  [KEYWORDS]: 'advKeywordId',
  [SEARCH_TERMS]: 'advSearchTermId',
  [CAMPAIGNS]: 'advCampaignId',
};

export const METRIC_ATTRIBUTES =
  'clicks,impressions,profit,cost,attributedSales30d,attributedSales14d,attributedUnitsOrdered30d,unitsSold14d,cr,acos,cpc,ctr';

export const LIST_BASE_PARAMS = [
  'page',
  'pageSize',
  'search',
  'sort',
  'campaignType',
  'attributes',
  'include',
];

export const LIST_DEFAULT_SORT = [
  {
    dataField: 'cost',
    order: 'desc',
  },
];

export const SORT_BY_COST = 'cost:desc';

export const LESS_THAN = 'lessThan';
export const LESS_THAN_OR_EQUAL_TO = 'lessThanOrEqualTo';
export const NOT_EQUAL_TO = 'notEqualTo';
export const EQUAL_TO = 'equalTo';
export const BETWEEN = 'between';
export const GREATER_THAN = 'greaterThan';
export const GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqualTo';

export const DEFAULT_COMPARISON = LESS_THAN;

export const COMPARISONS = [
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  NOT_EQUAL_TO,
  EQUAL_TO,
  BETWEEN,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
];

export const METRICS = [
  { display: 'Clicks', attribute: 'clicks' },
  { display: 'Impressions', attribute: 'impressions' },
  { display: 'Cost', attribute: 'cost' },
  {
    display: 'Sales',
    attribute: 'sales',
  },
  {
    display: 'Profit',
    attribute: 'profit',
  },
  {
    display: 'Orders',
    attribute: 'orders',
  },
  {
    display: 'CostPerClick',
    attribute: 'cpc',
  },
  {
    display: 'ConversionRate',
    attribute: 'cr',
  },
  {
    display: 'ClickThroughRate',
    attribute: 'ctr',
  },
  { display: 'ACOS', attribute: 'acos' },
];

export const CHANGE_TO = 'changeTo';
export const INCREASE_BY = 'increaseBy';
export const DECREASE_BY = 'decreaseBy';

export const VALUE = 'value';
export const PERCENTAGE = 'percentage';

export const CPC = 'cpc';
export const CAN_COMPARE_WITH_CPC = [
  'budget',
  'dailyBudget',
  'bid',
  'defaultBid',
];

// Rule action codes.
export const SP_CAMPAIGNS_UPDATE_BUDGET = 'SP:CAMPAIGNS:UPDATE_DAILY_BUDGET';
export const SP_CAMPAIGNS_UPDATE_STATUS = 'SP:CAMPAIGNS:UPDATE_STATUS';
export const SP_AD_GROUPS_UPDATE_STATUS = 'SP:AD_GROUPS:UPDATE_STATUS';
export const SP_AD_GROUPS_UPDATE_DEFAULT_BID =
  'SP:AD_GROUPS:UPDATE_DEFAULT_BID';
export const SP_KEYWORDS_UPDATE_STATUS = 'SP:KEYWORDS:UPDATE_STATUS';
export const SP_TARGETS_UPDATE_STATUS = 'SP:TARGETS:UPDATE_STATUS';
export const SP_KEYWORDS_UPDATE_BID = 'SP:KEYWORDS:UPDATE_BID';
export const SP_TARGETS_UPDATE_BID = 'SP:TARGETS:UPDATE_BID';
export const SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD =
  'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD';
export const SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP =
  'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP';

export const SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP =
  'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP';
