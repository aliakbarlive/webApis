const {
  Marketplace,
  RetroChargeEvent,
  RetroChargeTaxWithheld,
} = require('../../../models');

module.exports = async (RetrochargeEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const marketplaces = await Marketplace.findAll({
        attributes: ['marketplaceId', 'name'],
      });

      if (RetrochargeEventList !== undefined) {
        RetrochargeEventList.map(async (event) => {
          try {
            const {
              MarketplaceName: marketplaceName,
              PostedDate: postedDate,
              BaseTax,
              ShippingTax,
              RetrochargeTaxWithheldList,
            } = event;

            const marketplace = marketplaces.find(
              (m) => m.name == marketplaceName
            );

            const {
              CurrencyCode: baseTaxCurrencyCode,
              CurrencyAmount: baseTaxCurrencyAmount,
            } = BaseTax;

            const {
              CurrencyCode: shippingTaxCurrencyCode,
              CurrencyAmount: shippingTaxCurrencyAmount,
            } = ShippingTax;

            let RetroChargeTaxWithhelds = [];
            if (RetrochargeTaxWithheldList !== undefined) {
              RetrochargeTaxWithheldList.map((item) => {
                const {
                  TaxCollectionModel: taxCollectionModel,
                  TaxesWithheld,
                } = item;
                TaxesWithheld.map((item2) => {
                  const {
                    ChargeType: chargeType,
                    CurrencyCode: currencyCode,
                    CurrencyAmount: currencyAmount,
                  } = item2;

                  if (currencyAmount != 0) {
                    RetroChargeTaxWithhelds.push({
                      taxCollectionModel,
                      chargeType,
                      currencyCode,
                      currencyAmount,
                    });
                  }
                });
              });
            }

            let retroChargeEvent = {
              accountId,
              marketplaceId: marketplace ? marketplace.marketplaceId : null,
              marketplaceName,
              postedDate,
              baseTaxCurrencyCode,
              baseTaxCurrencyAmount,
              shippingTaxCurrencyCode,
              shippingTaxCurrencyAmount,
            };

            if (RetroChargeTaxWithhelds > 0) {
              retroChargeEvent.RetroChargeTaxWithhelds =
                RetroChargeTaxWithhelds;
            }

            // no identifier to check if the record already exists
            await RetroChargeEvent.create(retroChargeEvent, {
              include: [RetroChargeTaxWithheld],
            });
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong creating debt recovery events. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(RetrochargeEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on saving retro charge events. ${e.message}`
        )
      );
    }
  });
};
