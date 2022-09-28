const { NetworkComminglingTransactionEvent } = require('../../../models');

module.exports = async (NetworkComminglingTransactionEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NetworkComminglingTransactionEventList !== undefined) {
        NetworkComminglingTransactionEventList.map(async (event) => {
          try {
            const {
              TransactionType: transactionType,
              PostedDate: postedDate,
              NetCoTransactionId: netCoTransactionId,
              SwapReason: swapReason,
              ASIN: asin,
              MarketplaceId: marketplaceId,
              TaxExclusiveAmount,
              TaxAmount,
            } = event;

            const {
              CurrencyCode: taxExclusiveCurrencyCode,
              CurrencyCode: taxExclusiveCurrencyAmount,
            } = TaxExclusiveAmount;

            const {
              CurrencyCode: taxCurrencyCode,
              CurrencyCode: taxCurrencyAmount,
            } = TaxAmount;

            await NetworkComminglingTransactionEvent.findOrCreate({
              where: {
                accountId,
                postedDate,
                netCoTransactionId,
                asin,
              },
              defaults: {
                accountId,
                transactionType,
                postedDate,
                netCoTransactionId,
                swapReason,
                asin,
                marketplaceId,
                taxExclusiveCurrencyCode,
                taxExclusiveCurrencyAmount,
                taxCurrencyCode,
                taxCurrencyAmount,
              },
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
      return resolve(NetworkComminglingTransactionEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on network commingling transaction events. ${e.message}`
        )
      );
    }
  });
};
