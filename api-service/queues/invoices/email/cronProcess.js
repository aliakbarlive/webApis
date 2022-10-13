'use strict';
const moment = require('moment');
const { getInvoices } = require('../../../services/invoice.service');
const sendQueue = require('./send');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const cronProcess = async (job = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // limit on no. of days to process.
      let dayLimit = process.env.ZOHO_AUTO_EMAIL_DAYS;

      // recursive function for fetching invoices
      let getData = async (page, sizePerPage) => {
        let { invoices, page_context } = await getInvoices(
          'Pending',
          page,
          sizePerPage,
          'created_time'
        );

        if (invoices) {
          //filter invoices within the day limit and w/ pause_email == false|null
          let filtered = invoices.filter((invoice) => {
            let invoiceCreated = moment(invoice.created_time);
            let today = moment();

            if (
              today.diff(invoiceCreated, 'days') >= dayLimit &&
              (invoice.cf_pause_email == null ||
                invoice.cf_pause_email == 'false')
            ) {
              return true;
            }

            return false;
          });

          //add filtered invoices to emailQueue
          filtered.map((invoice) => {
            let {
              invoice_id: invoiceId,
              email,
              customer_id: zohoId,
              customer_name: name,
              number,
            } = invoice;

            return sendQueue.add({
              invoice: {
                invoiceId,
                email,
                zohoId,
                name,
                number,
              },
            });
          });

          // run getData again if there are still mroe pages to process
          if (page_context.has_more_page) {
            await getData(parseInt(page) + 1, sizePerPage);
          }
        }
      };

      // call page 1 (limit 25 per page) of pending invoices
      await getData(1, 25);

      return resolve({
        success: true,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = cronProcess;
