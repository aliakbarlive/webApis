'use strict';
const moment = require('moment');
const {
  getInvoiceErrorsNotNotified,
  markInvoiceErrorsAsNotified,
} = require('../../../services/invoiceError.service');
const fs = require('fs');
const path = require('path');
const sendRawEmail = require('../../ses/sendRawEmail');
const { dateFormatter } = require('../../../utils/formatters');

const notifyProcess = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { count, rows } = await getInvoiceErrorsNotNotified();

      if (count > 0) {
        let filePath = path.join(
          __dirname,
          `../../../email-templates/${process.env.COMMISSION_ERROR_NOTIFICATION_TEMPLATE}.html`
        );

        let template = fs.readFileSync(
          filePath,
          { encoding: 'utf-8' },
          function (err) {
            console.log(err);
          }
        );

        let data = rows.map((r) => {
          return `<tr>
          <td align="left"><a href="${process.env.SITE_URL}/clients/profile/${r.account.AgencyClient.agencyClientId}">${r.account.AgencyClient.client}</a></td>
                <td align="left"><a href="${process.env.SITE_URL}/invoices/${r.invoiceId}">${r.invoiceNumber}</a></td>                
                <td align="left">${r.description}</td>
            </tr>`;
        });

        let message = template
          .replace('{{notification_count}}', count)
          .replace('{{notification_date}}', dateFormatter(moment()))
          .replace('{{data}}', data.join(' '));

        await sendRawEmail.add(
          {
            email: process.env.INVOICE_EMAIL,
            subject: `${count} Invoice Commissions errors - ${dateFormatter(
              moment()
            )}`,
            message,
          },
          {
            attempts: 5,
            backoff: 1000 * 60 * 1,
          }
        );

        await markInvoiceErrorsAsNotified();

        return resolve({
          success: true,
          rows,
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = notifyProcess;
