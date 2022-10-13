const Queue = require('bull');
const {
  updateInvoiceRecord,
  getInvoice,
} = require('../../../services/invoice.service');

const queue = new Queue('Invoices - Webhook', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 300,
  },
  limiter: {
    max: 10,
    duration: 72000,
  },
});

// Process
if (process.env.MODE === 'queue') {
  queue.process(5, async (job, done) => {
    const { invoice, loaded } = job.data;

    try {
      let invoiceDetails = invoice;

      if (!loaded) {
        const { invoice: inv } = await getInvoice(invoice.invoiceId);
        invoiceDetails = inv;
      }

      const out = await updateInvoiceRecord(invoiceDetails);

      done();
    } catch (err) {
      console.log(err);
      done(new Error(err.message));
    }
  });

  queue.on('completed', async (job, result) => {
    console.log('Successfully saved invoice details from zoho');
  });

  queue.on('failed', function (job, result) {
    console.log('failed');
    console.log(result);
  });

  queue.on('progress', function (job, result) {
    console.log('progress');
  });

  queue.on('error', function (err) {
    console.log('error');
    console.log(err);
  });

  queue.on('active', function (job, err) {
    console.log('Zoho Invoice Sync webhook active');
  });
}

module.exports = queue;
