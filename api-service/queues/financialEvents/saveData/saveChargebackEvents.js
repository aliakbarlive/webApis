const {
  Marketplace,
  ChargebackEvent,
  ShipmentAdjustmentItem,
  ItemChargeAdjustment,
  ItemFeeAdjustment,
  ItemTaxWithheldAdjustment,
  ItemPromotionAdjustment,
} = require('../../../models');

module.exports = async (ChargebackEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const marketplaces = await Marketplace.findAll({
        attributes: ['marketplaceId', 'name'],
      });

      // Prepare Chargeback Events
      if (ChargebackEventList !== undefined) {
        ChargebackEventList.map(async (event) => {
          try {
            const {
              AmazonOrderId: amazonOrderId,
              SellerOrderId: sellerOrderId,
              MarketplaceName: marketplaceName,
              PostedDate: postedDate,
              ShipmentItemAdjustmentList,
            } = event;

            const marketplace = marketplaces.find(
              (m) => m.name == marketplaceName
            );

            let ShipmentAdjustmentItems = [];

            // compile child values here
            if (ShipmentItemAdjustmentList !== undefined) {
              // Shipment Items Adjustment
              ShipmentItemAdjustmentList.map((item) => {
                const {
                  OrderAdjustmentItemId: orderAdjustmentItemId,
                  SellerSKU: sellerSku,
                  QuantityShipped: quantityShipped,
                  ItemChargeAdjustmentList,
                  ItemFeeAdjustmentList,
                  ItemTaxWithheldList,
                  PromotionAdjustmentList,
                } = item;

                let ItemChargeAdjustments = [];
                let ItemFeeAdjustments = [];
                let ItemTaxWithheldAdjustments = [];
                let ItemPromotionAdjustments = [];

                if (
                  orderAdjustmentItemId !== undefined ||
                  sellerSku !== undefined ||
                  amazonOrderId !== undefined
                ) {
                  // Item Charge Adjustments
                  if (ItemChargeAdjustmentList !== undefined) {
                    ItemChargeAdjustmentList.map((itemCharge) => {
                      const { ChargeType: chargeType, ChargeAmount } =
                        itemCharge;
                      const {
                        CurrencyCode: currencyCode,
                        CurrencyAmount: currencyAmount,
                      } = ChargeAmount;
                      if (currencyAmount != 0) {
                        ItemChargeAdjustments.push({
                          orderAdjustmentItemId,
                          chargeType,
                          currencyCode,
                          currencyAmount,
                        });
                      }
                    });
                  }

                  // Item Fee Adjustments
                  if (ItemFeeAdjustmentList !== undefined) {
                    ItemFeeAdjustmentList.map((itemFee) => {
                      const { FeeType: chargeType, FeeAmount } = itemFee;
                      const {
                        CurrencyCode: currencyCode,
                        CurrencyAmount: currencyAmount,
                      } = FeeAmount;
                      if (currencyAmount != 0) {
                        ItemFeeAdjustments.push({
                          orderAdjustmentItemId,
                          chargeType,
                          currencyCode,
                          currencyAmount,
                        });
                      }
                    });
                  }

                  // Item Tax Withhelds
                  if (ItemTaxWithheldList !== undefined) {
                    ItemTaxWithheldList.map((ItemTaxWithheld) => {
                      const {
                        TaxesWithheld,
                        TaxCollectionModel: taxCollectionModel,
                      } = ItemTaxWithheld;
                      TaxesWithheld.map((Tax) => {
                        const { ChargeType: chargeType, ChargeAmount } = Tax;
                        const {
                          CurrencyCode: currencyCode,
                          CurrencyAmount: currencyAmount,
                        } = ChargeAmount;

                        if (currencyAmount != 0) {
                          ItemTaxWithheldAdjustments.push({
                            orderAdjustmentItemId,
                            taxCollectionModel,
                            chargeType,
                            currencyCode,
                            currencyAmount,
                          });
                        }
                      });
                    });
                  }

                  // Promotion Adjustments
                  if (PromotionAdjustmentList !== undefined) {
                    PromotionAdjustmentList.map((promotion) => {
                      const {
                        PromotionId: promotionId,
                        PromotionType: promotionType,
                        PromotionAmount,
                      } = promotion;
                      const {
                        CurrencyCode: currencyCode,
                        CurrencyAmount: currencyAmount,
                      } = PromotionAmount;

                      if (currencyAmount != 0) {
                        ItemPromotionAdjustments.push({
                          orderAdjustmentItemId,
                          promotionId,
                          promotionType,
                          currencyCode,
                          currencyAmount,
                        });
                      }
                    });
                  }

                  let shipmentAdjustmentItem = {
                    orderAdjustmentItemId,
                    amazonOrderId,
                    sellerSku,
                    quantityShipped,
                  };

                  if (ItemChargeAdjustments.length > 0) {
                    shipmentAdjustmentItem.ItemChargeAdjustments =
                      ItemChargeAdjustments;
                  }

                  if (ItemFeeAdjustments.length > 0) {
                    shipmentAdjustmentItem.ItemFeeAdjustments =
                      ItemFeeAdjustments;
                  }

                  if (ItemTaxWithheldAdjustments.length > 0) {
                    shipmentAdjustmentItem.ItemTaxWithheldAdjustments =
                      ItemTaxWithheldAdjustments;
                  }

                  if (ItemPromotionAdjustments.length > 0) {
                    shipmentAdjustmentItem.ItemPromotionAdjustments =
                      ItemPromotionAdjustments;
                  }

                  ShipmentAdjustmentItems.push(shipmentAdjustmentItem);
                }
              });
            }

            const exists = await ChargebackEvent.findOne({
              where: { amazonOrderId, postedDate },
            });
            if (exists == null) {
              await ChargebackEvent.create(
                {
                  postedDate,
                  amazonOrderId,
                  accountId,
                  sellerOrderId,
                  marketplaceId: marketplace ? marketplace.marketplaceId : null,
                  marketplaceName,
                  ShipmentAdjustmentItems:
                    ShipmentAdjustmentItems.length > 0
                      ? ShipmentAdjustmentItems
                      : null,
                },
                {
                  include: [
                    {
                      model: ShipmentAdjustmentItem,
                      include: [
                        ItemChargeAdjustment,
                        ItemFeeAdjustment,
                        ItemTaxWithheldAdjustment,
                        ItemPromotionAdjustment,
                      ],
                    },
                  ],
                }
              );
            }
          } catch (error) {
            console.log('Error on creating chargeback events with association');
            console.log(error);
          }
        });
      }
      return resolve(ChargebackEventList);
    } catch (error) {
      return reject(
        new Error(
          `Something went wrong on saving chargeback events. ${error.message}`
        )
      );
    }
  });
};
