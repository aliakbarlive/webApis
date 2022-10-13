const dotenv = require('dotenv');
const { sequelize, Invoice } = require('./models');
const syncInvoice = require('./queues/invoices/sync/syncInvoice');

const start = async () => {
  dotenv.config({ path: 'config/config.env' });
  await sequelize.authenticate();
  console.log('Database Connected!');

  try {
    const args = process.argv.slice(2);
    const page = args.length > 0 ? args[0] : 1;
    const pageSize = args.length > 0 ? args[1] : 10;
    const pageOffset = (page - 1) * pageSize;

    const invoices = await Invoice.findAll({
      limit: pageSize,
      offset: pageOffset,
      raw: true,
      order: [['invoiceNumber', 'ASC']],
    });

    invoices.forEach(async (invoice, index) => {
      console.log(invoice.invoiceId);
      await syncInvoice.add({ invoice, loaded: false });
    });
  } catch (err) {
    console.log(err);
  }
};

start();
