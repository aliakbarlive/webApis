const { ImagingServicesFeeEvent, ItemFee } = require('../../../models');

module.exports = async (ImagingServicesFeeEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (ImagingServicesFeeEventList !== undefined) {
        ImagingServicesFeeEventList.map(async (event) => {
          try {
            const {
              ImagingRequestBillingItemId: imagingRequestBillingItemID,
              ASIN: asin,
              PostedDate: postedDate,
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
                ItemFees.push({ feeType, currencyCode, currencyAmount });
              });
            }

            let imagingServicesFees = {
              accountId,
              imagingRequestBillingItemID,
              asin,
              postedDate,
            };
            if (ItemFees.length > 0) {
              imagingServicesFees.ItemFees = ItemFees;
            }

            const exists = await ImagingServicesFeeEvent.findOne({
              where: {
                accountId,
                postedDate,
                imagingRequestBillingItemID,
              },
            });
            if (exists == null) {
              await ImagingServicesFeeEvent.create(imagingServicesFees, {
                include: [ItemFee],
              });
            }
          } catch (e) {
            return reject(
              new Error(
                `Something went wrong creating imaging services events. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(ImagingServicesFeeEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on imaging services fee events. ${e.message}`
        )
      );
    }
  });
};
