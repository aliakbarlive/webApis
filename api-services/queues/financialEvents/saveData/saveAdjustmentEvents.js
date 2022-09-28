const { AdjustmentEvent, AdjustmentItem } = require('../../../models');

module.exports = async (AdjustmentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (AdjustmentEventList !== undefined) {
        AdjustmentEventList.map(async (event) => {
          try {
            const {
              PostedDate: postedDate,
              AdjustmentType: adjustmentType,
              AdjustmentAmount,
              AdjustmentItemList,
            } = event;
            const {
              CurrencyCode: currencyCode,
              CurrencyAmount: currencyAmount,
            } = AdjustmentAmount;

            let AdjustmentItems = [];
            if (AdjustmentItemList !== undefined) {
              AdjustmentItemList.map((item) => {
                const {
                  Quantity: quantity,
                  ASIN: asin,
                  SellerSKU: sellerSku,
                  FnSKU: fnSku,
                  TotalAmount,
                  PerUnitAmount,
                  ProductDescription: productDescription,
                } = item;
                const {
                  CurrencyCode: totalCurrencyCode,
                  CurrencyAmount: totalCurrencyAmount,
                } = TotalAmount;
                const {
                  CurrencyCode: perUnitCurrencyCode,
                  CurrencyAmount: perUnitCurrencyAmount,
                } = PerUnitAmount;
                AdjustmentItems.push({
                  quantity,
                  asin,
                  sellerSku,
                  fnSku,
                  productDescription,
                  totalCurrencyCode,
                  totalCurrencyAmount,
                  perUnitCurrencyCode,
                  perUnitCurrencyAmount,
                });
              });
            }

            const exists = await AdjustmentEvent.findOne({
              where: { adjustmentType, postedDate },
            });
            if (exists == null) {
              await AdjustmentEvent.create(
                {
                  accountId,
                  postedDate,
                  adjustmentType,
                  currencyCode,
                  currencyAmount,
                  AdjustmentItems,
                },
                {
                  include: [AdjustmentItem],
                }
              );
            }
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong creating adjustment events. ${e.message}`
              )
            );
          }
        });
      }

      return resolve(AdjustmentEventList);
    } catch (e) {
      return reject(
        new Error(`Something went wrong on adjustment events. ${e.message}`)
      );
    }
  });
};
