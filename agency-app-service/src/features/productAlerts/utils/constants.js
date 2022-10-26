export const STATISTICS_ATTRIBUTES = [
  'monitoredProducts',
  'maximumProducts',
  'enabledAlerts',
];

export const STATUS = 'status';
export const TITLE = 'title';
export const DESCRIPTION = 'description';
export const PRICE = 'price';
export const FEATURE_BULLETS = 'featureBullets';
export const LISTING_IMAGES = 'listingImages';
export const BUYBOX_WINNER = 'buyboxWinner';
export const CATEGORIES = 'categories';
export const REVIEWS = 'reviews';
export const LOW_STOCK = 'lowStock';
export const RATING = 'rating';
export const LOW_STOCK_THRESHOLD = 'lowStockThreshold';
export const RATING_CONDITION = 'ratingCondition';

export const RATING_CONDITION_ABOVE = 'above';
export const RATING_CONDITION_BELOW = 'below';

export const TOGGLE_TYPE = 'toggle';
export const CHECKBOX_TYPE = 'checkbox';
export const CUSTOM_TYPE = 'custom';

export const ATTRIBUTES = [
  { key: STATUS, type: TOGGLE_TYPE },
  { key: TITLE, type: CHECKBOX_TYPE },
  { key: DESCRIPTION, type: CHECKBOX_TYPE },
  { key: PRICE, type: CHECKBOX_TYPE },
  { key: FEATURE_BULLETS, type: CHECKBOX_TYPE },
  { key: LISTING_IMAGES, type: CHECKBOX_TYPE },
  { key: BUYBOX_WINNER, type: CHECKBOX_TYPE },
  { key: CATEGORIES, type: CHECKBOX_TYPE },
  { key: REVIEWS, type: CHECKBOX_TYPE },
  { key: LOW_STOCK, type: CHECKBOX_TYPE },
  { key: RATING, type: CHECKBOX_TYPE },
  { key: LOW_STOCK_THRESHOLD, type: CUSTOM_TYPE },
  { key: RATING_CONDITION, type: CUSTOM_TYPE },
];
