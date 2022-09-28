'use strict';
const moment = require('moment');
const {
  createNote,
  applyToInvoice,
} = require('../../../services/creditNote.service');
const { getInvoices } = require('../../../services/invoice.service');
const computeQueue = require('./compute');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const { CreditNote } = require('../../../models');

/**
 * Process Queued Credit Note Request
 * @param {object} invoice
 */
const processCreditNote = async (invoice) => {
  const { invoice_id, number, customer_id: customerId } = invoice;
  const creditNotes = await CreditNote.findAll({
    where: {
      customerId,
      status: 'queued',
    },
  });
  if (creditNotes) {
    creditNotes.map(async (cn) => {
      const {
        creditNoteId,
        customerId: customer_id,
        description,
        price,
        dateApplied: date,
        notes,
        terms,
      } = cn;

      // Create Credit Note on Zoho
      const creditNote = await createNote({
        customer_id,
        date: moment(date).format('YYYY-MM-DD'),
        creditnote_items: [
          {
            description,
            quantity: 1,
            price,
            tax_id: process.env.ZOHO_NO_TAX_ID,
          },
        ],
        reference_number: number,
        ignore_auto_number_generation: false,
        notes,
        terms,
      });

      if (creditNote) {
        const { creditnote_id, creditnote_number } = creditNote;
        // Store the reference of the created credit note on zoho
        await CreditNote.upsert({
          creditNoteId,
          status: 'approved',
          zohoCreditNoteId: creditnote_id,
          zohoCreditNoteNumber: creditnote_number,
        });

        // Apply credit note to the pending invoice
        await applyToInvoice(creditnote_id, {
          invoices: [
            {
              invoice_id,
              amount_applied: price,
            },
          ],
        });
      }
    });
  }
};

const cronProcess = async (job = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // limit on no. of days to process.
      let dayLimit = process.env.ZOHO_AUTO_COMMISSION_DAYS;

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
            // Check and Process credit note here
            processCreditNote(invoice);

            let invoiceCreated = moment(invoice.created_time);
            let today = moment();

            if (
              today.diff(invoiceCreated, 'days') >= dayLimit &&
              (!invoice.cf_commission_added ||
                (invoice.cf_commission_added &&
                  invoice.cf_commission_added_unformatted === false))
            ) {
              return true;
            }

            return false;
          });

          //add filtered invoices to computeQueue
          filtered.map((invoice) => {
            return computeQueue.add({
              invoiceId: invoice.invoice_id,
              invoiceNumber: invoice.number,
              invoiceDate: invoice.invoice_date,
              accountId: invoice.cf_bs_account_id_unformatted ?? null,
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
