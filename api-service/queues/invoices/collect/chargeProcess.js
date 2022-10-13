const zohoSubscription = require('../../../utils/zohoSubscription');
const invoiceService = require('../../../services/invoice.service');
const moment = require('moment');
const { method } = require('lodash');

const chargeProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { invoiceId } = job.data;

    try {
      const { invoice } = await invoiceService.getInvoice(invoiceId);

      const { cards } = await invoiceService.getCards(invoice.customer_id);

      if (!cards.length) {
        return reject('No credit cards found on file');
      }

      const collectCharge = await invoiceService.collectCharge(
        invoice,
        cards[0]
      );

      let description =
        collectCharge.code == 0
          ? `charge collected by bulk action ${moment().format()}`
          : `collect charge`;

      await invoiceService.addInvoiceComment(
        invoiceId,
        `${collectCharge.message} - ${description}`
      );

      return resolve({
        invoiceId,
        success: true,
      });

      // if (cardResponse.code == 0) {
      //   if (cardResponse.cards) {
      //     const card = cardResponse.cards[0];

      //     const collectResponse = await zohoSubscription.callAPI({
      //       method: 'POST',
      //       operation: `invoices/${invoiceId}/collect`,
      //       body: { card_id: card.card_id },
      //     });

      //     let description =
      //       collectResponse.code == 0
      //         ? `charge collected by bulk action ${moment().format()}`
      //         : `collect charge`;

      //     await addInvoiceComment(
      //       invoiceId,
      //       `${collectResponse.message} - ${description}`
      //     );

      //     return resolve({
      //       invoiceId,
      //       success: true,
      //     });
      //   }
      //   return reject('no card associated');
      // }
      // return reject(cardResponse);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = chargeProcess;
