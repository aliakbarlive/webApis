const {
  Marketplace,
  RentalTransactionEvent,
  ItemCharge,
  ItemFee,
  ItemWithheldTax,
} = require('../../../models');

module.exports = async (RentalTransactionEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const marketplaces = await Marketplace.findAll({
        attributes: ['marketplaceId', 'name'],
      });

      if (RentalTransactionEventList !== undefined) {
        RentalTransactionEventList.map(async (event) => {
          try {
            const {
              AmazonOrderId: amazonOrderId,
              RentalEventType: rentalEventType,
              ExtensionLength: extensionLength,
              PostedDate: postedDate,
              RentalChargeList,
              RentalFeeList,
              MarkeplaceName: marketplaceName,
              RentalInitialValue,
              RentalReimbursement,
              RentalTaxWithheldList,
            } = event;

            const marketplace = marketplaces.find(
              (m) => m.name == marketplaceName
            );

            const {
              CurrencyCode: rentalInitialValueCurrencyCode,
              CurrencyAmount: rentalInitialValueCurrencyAmount,
            } = RentalInitialValue;

            const {
              CurrencyCode: rentalReimbursementCurrencyCode,
              CurrencyAmount: rentalReimbursementCurrencyAmount,
            } = RentalReimbursement;

            let ItemCharges = [];
            let ItemFees = [];
            let ItemWithheldTaxes = [];

            if (RentalFeeList !== undefined) {
              RentalFeeList.map((item) => {
                const { FeeType: feeType, FeeAmount } = item;
                const {
                  CurrencyCode: currencyCode,
                  CurrencyAmount: currencyAmount,
                } = FeeAmount;
                ItemFees.push({ feeType, currencyCode, currencyAmount });
              });
            }

            if (RentalChargeList !== undefined) {
              RentalChargeList.map((item) => {
                const { ChargeType: chargeType, ChargeAmount } = item;
                const {
                  CurrencyCode: currencyCode,
                  CurrencyAmount: currencyAmount,
                } = ChargeAmount;
                ItemCharges.push({ chargeType, currencyCode, currencyAmount });
              });
            }

            if (RentalTaxWithheldList !== undefined) {
              RentalTaxWithheldList.map((item) => {
                const {
                  TaxCollectionModel: taxCollectionModel,
                  TaxesWithheld,
                } = item;
                if (TaxesWithheld !== undefined) {
                  TaxesWithheld.map((item2) => {
                    const {
                      ChargeType: chargeType,
                      CurrencyCode: currencyCode,
                      CurrencyAmount: currencyAmount,
                    } = item2;
                    ItemWithheldTaxes.push({
                      taxCollectionModel,
                      chargeType,
                      currencyCode,
                      currencyAmount,
                    });
                  });
                }
              });
            }

            let rentalTransaction = {
              accountId,
              amazonOrderId,
              rentalEventType,
              extensionLength,
              postedDate,
              marketplaceId: marketplace ? marketplace.marketplaceId : null,
              marketplaceName,
              rentalInitialValueCurrencyCode,
              rentalInitialValueCurrencyAmount,
              rentalReimbursementCurrencyCode,
              rentalReimbursementCurrencyAmount,
            };

            if (ItemCharges.length > 0) {
              rentalTransaction.ItemCharges = ItemCharges;
            }
            if (RentalChargeList.length > 0) {
              rentalTransaction.RentalChargeList = RentalChargeList;
            }
            if (ItemWithheldTaxes.length > 0) {
              rentalTransaction.ItemWithheldTaxes = ItemWithheldTaxes;
            }

            const exists = await RentalTransactionEvent.findOne({
              where: {
                amazonOrderId,
                postedDate,
              },
            });

            if (exists == null) {
              await RentalTransactionEvent.create(rentalTransaction, {
                include: [ItemCharge, ItemFee, ItemWithheldTax],
              });
            }
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong on saving rental transaction events. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(RentalTransactionEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on rental transaction events. ${e.message}`
        )
      );
    }
  });
};
