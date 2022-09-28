const { ProductAdsPaymentEvent } = require('../../../models');

module.exports = async (ProductAdsPaymentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (ProductAdsPaymentEventList !== undefined) {
        ProductAdsPaymentEventList.map(async (event) => {
          try {
            const {
              invoiceId,
              postedDate,
              transactionType,
              taxValue,
              baseValue,
              transactionValue,
            } = event;

            const {
              CurrencyCode: taxValueCurrencyCode,
              CurrencyAmount: taxValueCurrencyAmount,
            } = taxValue;

            const {
              CurrencyCode: baseCurrencyCode,
              CurrencyAmount: baseCurrencyAmount,
            } = baseValue;

            const {
              CurrencyCode: transactionCurrencyCode,
              CurrencyAmount: transactionCurrencyAmount,
            } = transactionValue;

            await ProductAdsPaymentEvent.findOrCreate({
              where: { invoiceId, postedDate },
              defaults: {
                accountId,
                invoiceId,
                postedDate,
                transactionType,
                taxValueCurrencyCode,
                taxValueCurrencyAmount,
                baseCurrencyCode,
                baseCurrencyAmount,
                transactionCurrencyCode,
                transactionCurrencyAmount,
              },
            });
          } catch (e) {}
        });
      }
      return resolve(ProductAdsPaymentEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on saving product ads payment events. ${e.message}`
        )
      );
    }
  });
};
