const { SolutionProviderCreditEvent } = require('../../../models');

module.exports = async (SolutionProviderCreditEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (SolutionProviderCreditEventList !== undefined) {
        SolutionProviderCreditEventList.map(async (event) => {
          try {
            const {
              ProviderTransactionType: providerTransactionType,
              SellerOrderId: sellerOrderId,
              MarketplaceId: marketplaceId,
              MarketplaceCountryCode: marketplaceCountryCode,
              SellerId: sellerId,
              SellerStoreName: sellerStoreName,
              ProviderId: providerId,
              ProviderStoreName: providerStoreName,
              TransactionCreationDate: transactionCreationDate,
              TransactionAmount,
            } = event;
            const {
              CurrencyCode: transactionCurrencyCode,
              CurrencyAmount: transactionCurrencyAmount,
            } = TransactionAmount;

            await SolutionProviderCreditEvent.findOrCreate({
              where: { sellerOrderId, transactionCreationDate },
              defaults: {
                accountId,
                providerTransactionType,
                sellerOrderId,
                marketplaceId,
                marketplaceCountryCode,
                sellerId,
                sellerStoreName,
                providerId,
                providerStoreName,
                transactionCurrencyCode,
                transactionCurrencyAmount,
                transactionCreationDate,
              },
            });
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong on creating solution provide credit events. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(SolutionProviderCreditEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on solution provider credit events. ${e.message}`
        )
      );
    }
  });
};
