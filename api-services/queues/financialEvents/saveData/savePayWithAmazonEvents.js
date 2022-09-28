const { PayWithAmazonEvent, ItemFee } = require('../../../models');

module.exports = async (PayWithAmazonEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (PayWithAmazonEventList !== undefined) {
        PayWithAmazonEventList.map(async (event) => {
          try {
            const {
              SellerOrderId: sellerOrderId,
              TransactionPostedDate: transactionPostedDate,
              BusinessObjectType: businessObjectType,
              SalesChannel: salesChannel,
              PaymentAmountType: paymentAmountType,
              AmountDescription: amountDescription,
              FulfillmentChannel: fulfillmentChannel,
              StoreName: storeName,
              Charge,
              FeeList,
            } = event;

            const { ChargeType: chargeType, ChargeAmount } = Charge;
            const {
              CurrencyCode: chargeCurrencyCode,
              CurrencyAmount: chargeCurrencyAmount,
            } = ChargeAmount;

            let ItemFees = [];
            if (FeeList !== undefined) {
              FeeList.map((item) => {
                const {
                  FeeType: feeType,
                  CurrencyCode: currencyCode,
                  CurrencyAmount: currencyAmount,
                } = item;

                if (currencyAmount != 0) {
                  ItemFees.push({
                    feeType,
                    currencyCode,
                    currencyAmount,
                  });
                }
              });
            }

            let payWithAmazonEvent = {
              accountId,
              sellerOrderId,
              transactionPostedDate,
              businessObjectType,
              salesChannel,
              paymentAmountType,
              amountDescription,
              fulfillmentChannel,
              storeName,
              chargeType,
              chargeCurrencyCode,
              chargeCurrencyAmount,
            };

            if (ItemFees.length > 0) {
              payWithAmazonEvent.ItemFees = ItemFees;
            }

            await PayWithAmazonEvent.create(payWithAmazonEvent, {
              include: [ItemFee],
            });
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong on creating pay with amazon events. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(PayWithAmazonEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on saving pay with amazon events. ${e.message}`
        )
      );
    }
  });
};
