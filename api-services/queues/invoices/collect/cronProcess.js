'use strict';
const moment = require('moment');
const { getInvoices } = require('../../../services/invoice.service');
const collectQueue = require('./charge');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const cronProcess = async (job = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { status } = job.data;

      // limit no. of days to process.
      let dayLimit = process.env.ZOHO_AUTO_COLLECT_DAYS;

      // recursive function for fetching invoices
      let getData = async (page, sizePerPage) => {
        let { invoices, page_context } = await getInvoices(
          status,
          page,
          sizePerPage,
          'due_date'
        );

        if (invoices) {
          let filtered = invoices.filter((invoice) => {
            let invoiceDueDate = moment(invoice.due_date);
            let today = moment();

            if (
              today.diff(invoiceDueDate, 'days') >= dayLimit &&
              (invoice.cf_pause_collect == null ||
                invoice.cf_pause_collect == 'false')
            ) {
              return true;
            }

            return false;
          });

          //add filtered invoices to collectQueue
          filtered.map((invoice) => {
            return collectQueue.add({
              invoiceId: invoice.invoice_id,
              invoiceNumber: invoice.number,
            });
          });

          console.log(filtered);

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
