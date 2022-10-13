const { CouponPaymentEvent } = require('../../../models');

module.exports = async (CouponPaymentEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (CouponPaymentEventList !== undefined) {
        CouponPaymentEventList.map(async (event) => {
          try {
            const {
              CouponId: couponId,
              PostedDate: postedDate,
              TotalAmount,
              FeeComponent,
              PaymentEventId: paymentEventId,
              ChargeComponent,
              ClipOrRedemptionCount: clipOrRedemptionCount,
              SellerCouponDescription: sellerCouponDescription,
            } = event;
            const {
              CurrencyCode: totalCurrencyCode,
              CurrencyAmount: totalCurrencyAmount,
            } = TotalAmount;
            const { FeeType: feeType, FeeAmount } = FeeComponent;
            const {
              CurrencyCode: feeCurrencyCode,
              CurrencyAmount: feeCurrencyAmount,
            } = FeeAmount;
            const { ChargeType: chargeType, ChargeAmount } = ChargeComponent;
            const {
              CurrencyCode: chargeCurrencyCode,
              CurrencyAmount: chargeCurrencyAmount,
            } = ChargeAmount;

            await CouponPaymentEvent.findOrCreate({
              where: { couponId, postedDate },
              defaults: {
                accountId,
                couponId,
                postedDate,
                paymentEventId,
                clipOrRedemptionCount,
                sellerCouponDescription,
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
                `Something went wrong creating coupon payment events. ${e.message}`
              )
            );
          }
        });
      }

      return resolve(CouponPaymentEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong with coupon payment events. ${e.message}`
        )
      );
    }
  });
};
