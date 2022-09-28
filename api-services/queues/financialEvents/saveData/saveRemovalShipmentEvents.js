const {
  RemovalShipmentEvent,
  RemovalShipmentItem,
} = require('../../../models');

module.exports = async (RemovalShipmentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (RemovalShipmentEventList !== undefined) {
        RemovalShipmentEventList.map(async (event) => {
          try {
            const {
              PostedDate: postedDate,
              OrderId: orderId,
              TransactionType: transactionType,
              RemovalShipmentItemList,
            } = event;

            let RemovalShipmentItems = [];
            if (RemovalShipmentItemList !== undefined) {
              RemovalShipmentItemList.map((item) => {
                const {
                  RemovalShipmentItemId: removalShipmentItemId,
                  TaxCollectionModel: taxCollectionModel,
                  FulfillmentNetworkSKU: fulfillmentNetworkSku,
                  Quantity: quantity,
                  Revenue,
                  FeeAmount,
                  TaxAmount,
                  TaxWithheld,
                } = item;

                const {
                  CurrencyCode: revenueCurrencyCode,
                  CurrencyAmount: revenueCurrencyAmount,
                } = Revenue;
                const {
                  CurrencyCode: feeCurrencyCode,
                  CurrencyAmount: feeCurrencyAmount,
                } = FeeAmount;
                const {
                  CurrencyCode: taxCurrencyCode,
                  CurrencyAmount: taxCurrencyAmount,
                } = TaxAmount;
                const {
                  CurrencyCode: taxWithheldCurrencyCode,
                  CurrencyAmount: taxWithheldCurrencyAmount,
                } = TaxWithheld;

                RemovalShipmentItems.push({
                  removalShipmentItemId,
                  taxCollectionModel,
                  fulfillmentNetworkSku,
                  quantity,
                  revenueCurrencyCode,
                  revenueCurrencyAmount,
                  feeCurrencyCode,
                  feeCurrencyAmount,
                  taxCurrencyCode,
                  taxCurrencyAmount,
                  taxWithheldCurrencyCode,
                  taxWithheldCurrencyAmount,
                });
              });
            }

            let removalEvent = {
              accountId,
              postedDate,
              orderId,
              transactionType,
            };

            if (RemovalShipmentItems.length > 0) {
              removalEvent.RemovalShipmentItems = RemovalShipmentItems;
            }

            const exists = await RemovalShipmentEvent.findOne({
              where: { accountId, orderId, postedDate },
            });

            if (exists == null) {
              await RemovalShipmentEvent.create(removalEvent, {
                include: [RemovalShipmentItem],
              });
            }
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong creating removal shipment events. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(RemovalShipmentEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on removal shipment events. ${e.message}`
        )
      );
    }
  });
};
