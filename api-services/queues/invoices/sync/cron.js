'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const { keys } = require('lodash');

dotenv.config({ path: 'config/config.env' });
const { Invoice } = require('../../../models');

const zohoSubscription = require('../../../utils/zohoSubscription');

let queue = Queue('Invoices - Sync Cron', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(10, async (job) => {
    const { page = 1 } = job.data;

    return new Promise(async (resolve, reject) => {
      try {
        const output = await zohoSubscription.callAPI({
          method: 'GET',
          operation: `invoices?page=${page}&per_page=${200}&sort_column=number&sort_order=D`,
        });

        const { invoices, page_context } = output.data;

        if (invoices.length) {
          await Invoice.bulkCreate(
            invoices.map((invoice) => {
              return {
                total: invoice.total,
                status: invoice.status,
                balance: invoice.balance,
                invoiceNumber: invoice.number,
                invoiceId: invoice.invoice_id,
                createdAt: invoice.created_time,
                updatedAt: invoice.updated_time,
                customerId: invoice.customer_id,
                invoiceDate: invoice.invoice_date,
                currencyCode: invoice.currency_code,
                currencySymbol: invoice.currency_symbol,
                transactionType: invoice.transaction_type,
              };
            }),
            {
              updateOnDuplicate: keys(Invoice.rawAttributes),
            }
          );
        }

        return resolve({
          page: page_context.page,
          sizePerPage: page_context.per_page,
          hasMorePage: page_context.has_more_page,
        });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async (job) => {
    const { hasMorePage, page } = job.returnvalue;

    if (hasMorePage) {
      queue.add({ page: page + 1 });
    }

    console.log(`invoice-sync-completed`);
  });

  queue.on('failed', function (job, result) {
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log(err);
  });

  queue.on('active', function (job, err) {
    console.log(`invoice-sync-active`);
  });
}

module.exports = queue;
