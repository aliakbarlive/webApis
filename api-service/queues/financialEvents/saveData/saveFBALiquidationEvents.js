const { FbaLiquidationEvent } = require('../../../models');

module.exports = async (FBALiquidationEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (FBALiquidationEventList !== undefined) {
        FBALiquidationEventList.map(async (event) => {
          try {
            const {
              PostedDate: postedDate,
              OriginalRemovalOrderId: originalRemovalOrderId,
              LiquidationProceedsAmount,
              LiquidationFeeAmount,
            } = event;

            const {
              CurrencyCode: liquidationProceedsCurrencyCode,
              CurrencyAmount: liquidationProceedsCurrencyAmount,
            } = LiquidationProceedsAmount;

            const {
              CurrencyCode: liquidationFeeCurrencyCode,
              CurrencyAmount: liquidationFeeCurrencyAmount,
            } = LiquidationFeeAmount;

            await FbaLiquidationEvent.findOrCreate({
              where: { accountId, postedDate, originalRemovalOrderId },
              defaults: {
                accountId,
                postedDate,
                originalRemovalOrderId,
                liquidationProceedsCurrencyCode,
                liquidationProceedsCurrencyAmount,
                liquidationFeeCurrencyCode,
                liquidationFeeCurrencyAmount,
              },
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
      return resolve(FBALiquidationEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on fba liquidation events. ${e.message}`
        )
      );
    }
  });
};
