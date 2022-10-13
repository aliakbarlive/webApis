const { SellerReviewEnrollmentPaymentEvent } = require('../../../models');

module.exports = async (SellerReviewEnrollmentPaymentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (SellerReviewEnrollmentPaymentEventList !== undefined) {
        SellerReviewEnrollmentPaymentEventList.map(async (event) => {
          try {
            const {
              ParentAsin: parentAsin,
              PostedDate: postedDate,
              TotalAmount,
              EnrollmentId: enrollmentId,
              FeeComponent,
              ChargeComponent,
            } = event;
            const {
              CurrencyCode: totalCurrencyCode,
              CurrencyAmount: totalCurrencyAmount,
            } = TotalAmount;

            const {
              FeeType: feeType,
              CurrencyCode: feeCurrencyCode,
              CurrencyAmount: feeCurrencyAmount,
            } = FeeComponent;

            const {
              ChargeType: chargeType,
              CurrencyCode: chargeCurrencyCode,
              CurrencyAmount: chargeCurrencyAmount,
            } = ChargeComponent;

            await SellerReviewEnrollmentPaymentEvent.findOrCreate({
              where: { accountId, postedDate, enrollmentId },
              defaults: {
                accountId,
                parentAsin,
                postedDate,
                enrollmentId,
                totalCurrencyCode,
                totalCurrencyAmount,
                feeType,
                feeCurrencyCode,
                feeCurrencyAmount,
                chargeType,
                chargeCurrencyCode,
                chargeCurrencyAmount,
              },
            });
          } catch (e) {
            console.log(e);
            return reject(
              new Error(
                `Something went wrong creating seller review enrollment payment event. ${e.message}`
              )
            );
          }
        });
      }
      return resolve(SellerReviewEnrollmentPaymentEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong with seller review enrollment payment events. ${e.message}`
        )
      );
    }
  });
};
