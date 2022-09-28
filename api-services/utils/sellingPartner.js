const SellingPartnerAPI = require('amazon-sp-api');

const sellingPartner = (region, refreshToken) => {
  return new SellingPartnerAPI({
    region,
    refresh_token: refreshToken,
  });
};

module.exports = sellingPartner;
