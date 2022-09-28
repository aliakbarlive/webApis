const { LoanServicingEvent } = require('../../../models');

module.exports = async (LoanServicingEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (LoanServicingEventList !== undefined) {
        LoanServicingEventList.map(async (event) => {
          try {
            const {
              SourceBusinessEventType: sourceBusinessEventType,
              LoanAmount,
            } = event;
            const {
              CurrencyCode: loanCurrencyCode,
              CurrencyAmount: loanCurrencyAmount,
            } = LoanAmount;

            await LoanServicingEvent.create({
              accountId,
              sourceBusinessEventType,
              loanCurrencyCode,
              loanCurrencyAmount,
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
      return resolve(LoanServicingEventList);
    } catch (e) {
      return reject(
        new Error(`Something went wrong on loan servicing events. ${e.message}`)
      );
    }
  });
};
