const { SellerDealPaymentEvent } = require('../../../models');

module.exports = async (SellerDealPaymentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (SellerDealPaymentEventList !== undefined) {
        SellerDealPaymentEventList.map(async (event) => {
          try {
            const {
              postedDate,
              dealId,
              dealDescription,
              eventType,
              feeType,
              feeAmount,
              taxAmount,
              totalAmount,
            } = event;

            const {
              CurrencyCode: feeCurrencyCode,
              CurrencyAmount: feeCurrencyAmount,
            } = feeAmount;
            const {
              CurrencyCode: taxCurrencyCode,
              CurrencyAmount: taxCurrencyAmount,
            } = taxAmount;
            const {
              CurrencyCode: totalCurrencyCode,
              CurrencyAmount: totalCurrencyAmount,
            } = totalAmount;

            await SellerDealPaymentEvent.findOrCreate({
              where: { dealId, postedDate, accountId },
              defaults: {
                accountId,
                postedDate,
                dealId,
                dealDescription,
                eventType,
                feeType,
                feeCurrencyCode,
                feeCurrencyAmount,
                taxCurrencyCode,
                taxCurrencyAmount,
                totalCurrencyCode,
                totalCurrencyAmount,
              },
            });
          } catch (e) {
            console.log(e);
          }
        });
      }

      return resolve(SellerDealPaymentEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on seller deal payment events. ${e.message}`
        )
      );
    }
  });
};
