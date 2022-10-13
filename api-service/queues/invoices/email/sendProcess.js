const zohoSubscription = require('../../../utils/zohoSubscription');
const {
  getInvoiceEmailsByZohoId,
} = require('../../../services/agencyClient.service');
const fs = require('fs');
const path = require('path');
const {
  getInvoice,
  resolveAgencyClient,
} = require('../../../services/invoice.service');
const {
  getSubscriptionRecord,
  getSubscriptionRecordByAccountId,
} = require('../../../services/subscription.service');

const sendProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { invoice } = job.data;
    const { invoiceId, email, zohoId, name, number } = invoice;

    try {
      // check if subscription is offline
      // if offline, fetch invoice and get invoice_url to be added to email
      // email format will be different for offline invoices
      const agencyClient = await resolveAgencyClient(invoiceId, zohoId);
      const sub_rec = await getSubscriptionRecordByAccountId(
        agencyClient.accountId
      );

      let emailTemplate = process.env.REVIEW_INVOICE_TEMPLATE;
      let invoiceUrl = '';

      if (sub_rec && sub_rec.isOffline) {
        const { invoice: inv } = await getInvoice(invoiceId);
        emailTemplate = process.env.REVIEW_INVOICE_OFFLINE_TEMPLATE;
        invoiceUrl = inv.invoice_url;
      }

      // Get invoice emails of the agency client
      const { invoiceEmails } = await getInvoiceEmailsByZohoId(zohoId);

      // default email
      let to_mail_ids = [email];
      if (invoiceEmails !== null && invoiceEmails.length > 0) {
        to_mail_ids = invoiceEmails;
      }

      let filePath = path.join(
        __dirname,
        `../../../email-templates/${emailTemplate}.html`
      );

      //console.log(filePath);

      let template = fs.readFileSync(
        filePath,
        { encoding: 'utf-8' },
        function (err) {
          console.log(err);
        }
      );

      let filledTemplate = template
        .replace('{{client_name}}', name)
        .replace('{{invoice_url}}', invoiceUrl);

      //console.log(filledTemplate);

      let res = await zohoSubscription.callAPI({
        method: 'POST',
        operation: `invoices/${invoiceId}/email`,
        body: {
          to_mail_ids,
          subject: `Invoice from Seller Interactive (Invoice#: ${number})`,
          body: filledTemplate,
        },
      });

      if (res.code == 0) {
        return resolve({
          invoiceId,
          success: true,
        });
      }

      return reject(res.message);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = sendProcess;
