const { AffordabilityExpenseReversalEvent } = require('../../../models');

module.exports = async (AffordabilityExpenseReversalEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (AffordabilityExpenseReversalEventList !== undefined) {
        AffordabilityExpenseReversalEventList.map(async (event) => {
          try {
            const {
              AmazonOrderId: amazonOrderId,
              PostedDate: postedDate,
              MarketplaceId: marketplaceId,
              TransactionType: transactionType,
              BaseExpense,
              TaxTypeCGST,
              TaxTypeSGST,
              TaxTypeIGST,
              TotalExpense,
            } = event;

            let baseExpenseCurrencyCode = '',
              taxTypeCGSTCurrencyCode = '',
              taxTypeSGSTCurrencyCode = '',
              taxTypeIGSTCurrencyCode = '',
              totalExpenseCurrencyCode = '';

            let baseExpenseCurrencyAmount = 0,
              taxTypeCGSTCurrencyAmount = 0,
              taxTypeSGSTCurrencyAmount = 0,
              taxTypeIGSTCurrencyAmount = 0,
              totalExpenseCurrencyAmount = 0;

            if (BaseExpense !== undefined) {
              const { CurrencyCode, CurrencyAmount } = BaseExpense;
              baseExpenseCurrencyCode = CurrencyCode;
              baseExpenseCurrencyAmount = CurrencyAmount;
            }

            if (TaxTypeCGST !== undefined) {
              const { CurrencyCode, CurrencyAmount } = TaxTypeCGST;
              taxTypeCGSTCurrencyCode = CurrencyCode;
              taxTypeCGSTCurrencyAmount = CurrencyAmount;
            }

            if (TaxTypeSGST !== undefined) {
              const { CurrencyCode, CurrencyAmount } = TaxTypeSGST;
              taxTypeSGSTCurrencyCode = CurrencyCode;
              taxTypeSGSTCurrencyAmount = CurrencyAmount;
            }

            if (TaxTypeIGST !== undefined) {
              const { CurrencyCode, CurrencyAmount } = TaxTypeIGST;
              taxTypeIGSTCurrencyCode = CurrencyCode;
              taxTypeIGSTCurrencyAmount = CurrencyAmount;
            }

            if (TotalExpense !== undefined) {
              const { CurrencyCode, CurrencyAmount } = TotalExpense;
              totalExpenseCurrencyCode = CurrencyCode;
              totalExpenseCurrencyAmount = CurrencyAmount;
            }

            await AffordabilityExpenseReversalEvent.findOrCreate({
              where: {
                accountId,
                amazonOrderId,
                postedDate,
              },
              defaults: {
                accountId,
                amazonOrderId,
                postedDate,
                marketplaceId,
                transactionType,
                baseExpenseCurrencyCode,
                baseExpenseCurrencyAmount,
                taxTypeCGSTCurrencyCode,
                taxTypeCGSTCurrencyAmount,
                taxTypeSGSTCurrencyCode,
                taxTypeSGSTCurrencyAmount,
                taxTypeIGSTCurrencyCode,
                taxTypeIGSTCurrencyAmount,
                totalExpenseCurrencyCode,
                totalExpenseCurrencyAmount,
              },
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
      return resolve(AffordabilityExpenseReversalEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on affordability expense reversal events. ${e.message}`
        )
      );
    }
  });
};
