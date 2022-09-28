const CAMPAIGN_TYPE_SALES_ATTRIBUTE = {
  sponsoredBrands: 'attributedSales14d',
  sponsoredProducts: 'attributedSales30d',
  sponsoredDisplay: 'attributedSales30d',
};

const CAMPAIGN_TYPE_CONVERSIONS_ATTRIBUTE = {
  sponsoredBrands: 'attributedConversions14d',
  sponsoredProducts: 'attributedConversions30d',
  sponsoredDisplay: 'attributedConversions30d',
};

const CAMPAIGN_TYPE_ORDERS_ATTRIBUTE = {
  sponsoredBrands: 'unitsSold14d',
  sponsoredProducts: 'attributedUnitsOrdered30d',
  sponsoredDisplay: 'attributedUnitsOrdered30d',
};

module.exports = {
  CAMPAIGN_TYPE_SALES_ATTRIBUTE,
  CAMPAIGN_TYPE_CONVERSIONS_ATTRIBUTE,
  CAMPAIGN_TYPE_ORDERS_ATTRIBUTE,
};
