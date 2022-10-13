const syncInvoiceCron = require('./queues/invoices/sync/syncInvoicesCron');

const start = async () => {
  const args = process.argv.slice(2);
  const page = args.length > 0 ? args[0] : 1;

  console.log(page);
  await syncInvoiceCron.add(
    { page },
    {
      delay: 1000 * 60 * 120,
    }
  );
};

start();
