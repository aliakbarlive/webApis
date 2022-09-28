const {
  DebtRecoveryEvent,
  ChargeInstrument,
  DebtRecoveryItem,
} = require('../../../models');

module.exports = async (DebtRecoveryEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (DebtRecoveryEventList !== undefined) {
        DebtRecoveryEventList.map(async (event) => {
          try {
            const {
              RecoveryAmount,
              OverPaymentCredit,
              DebtRecoveryType: debtRecoveryType,
              ChargeInstrumentList,
              DebtRecoveryItemList,
            } = event;
            const {
              CurrencyCode: recoveryCurrencyCode,
              CurrencyAmount: recoveryCurrencyAmount,
            } = RecoveryAmount;

            let overPaymentCreditCurrencyCode = '';
            let overPaymentCreditCurrencyAmount = 0;
            if (OverPaymentCredit !== undefined) {
              const { CurrencyCode, CurrencyAmount } = OverPaymentCredit;
              overPaymentCreditCurrencyCode = CurrencyCode;
              overPaymentCreditCurrencyAmount = CurrencyAmount;
            }

            let debtRecoveryArray = {
              accountId,
              debtRecoveryType,
              recoveryCurrencyCode,
              recoveryCurrencyAmount,
              overPaymentCreditCurrencyCode,
              overPaymentCreditCurrencyAmount,
            };
            let ChargeInstruments = [];
            let DebtRecoveryItems = [];

            if (ChargeInstrumentList !== undefined) {
              ChargeInstrumentList.map((item) => {
                const { Tail: tail, Amount, Description: description } = item;
                const {
                  CurrencyCode: currencyCode,
                  CurrencyAmount: currencyAmount,
                } = Amount;
                ChargeInstruments.push({
                  tail,
                  description,
                  currencyCode,
                  currencyAmount,
                });
              });
            }

            if (DebtRecoveryItemList !== undefined) {
              DebtRecoveryItemList.map((item) => {
                const {
                  GroupBeginDate: groupBeginDate,
                  GroupEndDate: groupEndDate,
                  OriginalAmount,
                  RecoveryAmount,
                } = item;
                const {
                  CurrencyCode: originalCurrencyCode,
                  CurrencyAmount: originalCurrencyAmount,
                } = OriginalAmount;
                const {
                  CurrencyCode: recoveryCurrencyCode,
                  CurrencyAmount: recoveryCurrencyAmount,
                } = RecoveryAmount;
                DebtRecoveryItems.push({
                  groupBeginDate,
                  groupEndDate,
                  originalCurrencyCode,
                  originalCurrencyAmount,
                  recoveryCurrencyCode,
                  recoveryCurrencyAmount,
                });
              });
            }

            if (ChargeInstruments.length > 0) {
              debtRecoveryArray.ChargeInstruments = ChargeInstruments;
            }
            if (DebtRecoveryItems.length > 0) {
              debtRecoveryArray.DebtRecoveryItems = DebtRecoveryItems;
            }

            await DebtRecoveryEvent.create(debtRecoveryArray, {
              include: [ChargeInstrument, DebtRecoveryItem],
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
      return resolve(DebtRecoveryEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong with debt recovery events. ${e.message}`
        )
      );
    }
  });
};
