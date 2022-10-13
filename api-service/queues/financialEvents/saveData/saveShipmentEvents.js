const {
  Marketplace,
  ShipmentEvent,
  ShipmentItem,
  ItemCharge,
  ItemFee,
  ItemWithheldTax,
  ItemPromotion,
} = require('../../../models');

module.exports = async (ShipmentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const marketplaces = await Marketplace.findAll({
        attributes: ['marketplaceId', 'name'],
      });

      // Prepare Shipment Events
      if (ShipmentEventList !== undefined) {
        ShipmentEventList.map(async (event) => {
          try {
            const {
              AmazonOrderId: amazonOrderId,
              SellerOrderId: sellerOrderId,
              MarketplaceName: marketplaceName,
              PostedDate: postedDate,
              ShipmentItemList,
            } = event;

            const marketplace = marketplaces.find(
              (m) => m.name == marketplaceName
            );

            let ShipmentItems = [];

            // compile child values here
            if (ShipmentItemList !== undefined) {
              // Shipment Items
              ShipmentItemList.map((item) => {
                const {
                  OrderItemId: orderItemId,
                  SellerSKU: sellerSku,
                  QuantityShipped: quantityShipped,
                  ItemChargeList,
                  ItemFeeList,
                  ItemTaxWithheldList,
                  PromotionList,
                } = item;

                let ItemCharges = [];
                let ItemFees = [];
                let ItemWithheldTaxes = [];
                let ItemPromotions = [];

                if (sellerSku !== undefined || amazonOrderId !== undefined) {
                  // Item Charges
                  if (ItemChargeList !== undefined) {
                    ItemChargeList.map((itemCharge) => {
                      const { ChargeType: chargeType, ChargeAmount } =
                        itemCharge;
                      const {
                        CurrencyCode: currencyCode,
                        CurrencyAmount: currencyAmount,
                      } = ChargeAmount;
                      if (currencyAmount != 0) {
                        ItemCharges.push({
                          chargeType,
                          currencyCode,
                          currencyAmount,
                        });
                      }
                    });
                  }

                  // Item Fees
                  if (ItemFeeList !== undefined) {
                    ItemFeeList.map((itemFee) => {
                      const { FeeType: feeType, FeeAmount } = itemFee;
                      const {
                        CurrencyCode: currencyCode,
                        CurrencyAmount: currencyAmount,
                      } = FeeAmount;
                      if (currencyAmount != 0) {
                        ItemFees.push({
                          feeType,
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
                          ItemWithheldTaxes.push({
                            taxCollectionModel,
                            chargeType,
                            currencyCode,
                            currencyAmount,
                          });
                        }
                      });
                    });
                  }

                  // Promotions
                  if (PromotionList !== undefined) {
                    PromotionList.map((promotion) => {
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
                        ItemPromotions.push({
                          promotionId,
                          promotionType,
                          currencyCode,
                          currencyAmount,
                        });
                      }
                    });
                  }

                  let shipmentItem = {
                    orderItemId,
                    amazonOrderId,
                    sellerSku,
                    quantityShipped,
                  };

                  if (ItemCharges.length > 0) {
                    shipmentItem.ItemCharges = ItemCharges;
                  }

                  if (ItemFees.length > 0) {
                    shipmentItem.ItemFees = ItemFees;
                  }

                  if (ItemWithheldTaxes.length > 0) {
                    shipmentItem.ItemWithheldTaxes = ItemWithheldTaxes;
                  }

                  if (ItemPromotions.length > 0) {
                    shipmentItem.ItemPromotions = ItemPromotions;
                  }

                  ShipmentItems.push(shipmentItem);
                }
              });
            }

            const exists = await ShipmentEvent.findOne({
              where: { amazonOrderId, postedDate },
            });
            if (exists == null) {
              await ShipmentEvent.create(
                {
                  postedDate,
                  amazonOrderId,
                  accountId,
                  sellerOrderId,
                  marketplaceId: marketplace ? marketplace.marketplaceId : null,
                  marketplaceName,
                  ShipmentItems:
                    ShipmentItems.length > 0 ? ShipmentItems : null,
                },
                {
                  include: [
                    {
                      model: ShipmentItem,
                      include: [
                        ItemCharge,
                        ItemFee,
                        ItemWithheldTax,
                        ItemPromotion,
                      ],
                    },
                  ],
                }
              );
            }
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong creating shipment events. ${e.message}`
              )
            );
          }
        });
      }

      return resolve(ShipmentEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on saving shipment events. ${e.message}`
        )
      );
    }
  });
};
