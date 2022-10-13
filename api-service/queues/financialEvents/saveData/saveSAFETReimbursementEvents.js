const {
  SAFETReimbursementEvent,
  SAFETReimbursementItem,
  ItemCharge,
} = require('../../../models');

module.exports = async (SAFETReimbursementEventList, accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (SAFETReimbursementEventList !== undefined) {
        SAFETReimbursementEventList.map(async (event) => {
          try {
            const {
              PostedDate: postedDate,
              SAFETClaimId: safetClaimId,
              ReimbursedAmount,
              ReasonCode: reasonCode,
              SAFETReimbursementItemList,
            } = event;
            const {
              CurrencyCode: reimbursedCurrencyCode,
              CurrencyAmount: reimbursedCurrencyAmount,
            } = ReimbursedAmount;

            let SAFETReimbursementItems = [];
            if (SAFETReimbursementItemList !== undefined) {
              SAFETReimbursementItemList.map((item) => {
                const { productDescription, quantity, itemChargeList } = item;
                let ItemCharges = [];
                if (itemChargeList !== undefined) {
                  itemChargeList.map((item2) => {
                    const {
                      ChargeType: chargeType,
                      CurrencyCode: currencyCode,
                      CurrencyAmount: currencyAmount,
                    } = item2;
                    ItemCharges.push({
                      chargeType,
                      currencyCode,
                      currencyAmount,
                    });
                  });
                }
                let items = {
                  productDescription,
                  quantity,
                };

                if (ItemCharges !== undefined) {
                  items.ItemCharges = ItemCharges;
                }

                SAFETReimbursementItems.push(items);
              });
            }

            let safetData = {
              accountId,
              postedDate,
              safetClaimId,
              reasonCode,
              reimbursedCurrencyCode,
              reimbursedCurrencyAmount,
            };

            if (SAFETReimbursementItems.length > 0) {
              safetData.SAFETReimbursementItems = SAFETReimbursementItems;
            }

            const exists = await SAFETReimbursementEvent.findOne({
              where: { postedDate, accountId, safetClaimId },
            });
            if (exists == null) {
              await SAFETReimbursementEvent.create(safetData, {
                include: [
                  {
                    model: SAFETReimbursementItem,
                    include: [ItemCharge],
                  },
                ],
              });
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
      return resolve(SAFETReimbursementEventList);
    } catch (e) {
      return reject(
        new Error(
          `Something went wrong on SAFETReimbursement events. ${e.message}`
        )
      );
    }
  });
};
