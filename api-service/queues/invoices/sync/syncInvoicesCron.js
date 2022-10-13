'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });
const { Invoice } = require('../../../models');

const syncInvoice = require('./syncInvoice');

let queue = Queue('Invoices - Webhook Cron', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 20,
  },
  limiter: {
    max: 1,
    duration: 1000 * 60 * 120,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(1, async (job) => {
    const { page = 1 } = job.data;

    return new Promise(async (resolve, reject) => {
      try {
        const pageSize = 100;
        const pageOffset = (page - 1) * pageSize;

        const invoices = await Invoice.findAll({
          limit: pageSize,
          offset: pageOffset,
          where: { status: 'paid' },
          raw: true,
          order: [['invoiceNumber', 'ASC']],
        });

        invoices.forEach(async (invoice, index) => {
          await syncInvoice.add({ invoice, loaded: false });
        });

        return resolve({
          page,
          pageSize,
          pageOffset,
        });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async (job) => {
    const { page, pageSize, pageOffset } = job.returnvalue;

    queue.add({ page: parseInt(page) + 1 });

    console.log(`invoice-sync-completed`, page, pageSize, pageOffset);
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
