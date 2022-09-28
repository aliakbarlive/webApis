const { ServiceFeeEvent, ItemFee } = require('../../../models');

module.exports = async (ServiceFeeEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (ServiceFeeEventList !== undefined) {
        ServiceFeeEventList.map(async (event) => {
          try {
            const {
              SellerSKU: sellerSku,
              FnSKU: fnSku,
              AmazonOrderId: amazonOrderId,
              FeeDescription: feeDescription,
              FeeReason: feeReason,
              ASIN: asin,
              FeeList,
            } = event;

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
            let serviceFee = {
              accountId,
              sellerSku,
              fnSku,
              amazonOrderId,
              feeDescription,
              feeReason,
              asin,
            };
            if (ItemFees.length > 0) {
              serviceFee.ItemFees = ItemFees;
            }

            await ServiceFeeEvent.create(serviceFee, { include: [ItemFee] });
          } catch (e) {
            console.log(e);
          }
        });
      }

      return resolve(ServiceFeeEventList);
    } catch (e) {
      return reject(
        new Error(`Something went wrong on service fee events. ${e.message}`)
      );
    }
  });
};
