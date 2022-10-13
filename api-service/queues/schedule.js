const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const cronEmailQueue = require(`./invoices/email/cron`);
const cronCollectQueue = require(`./invoices/collect/cron`);
const cronCommissionQueue = require('./invoices/commission/cron');
const syncInvoiceQueue = require('./invoices/sync/cron');
const cronAdvCampaignRecommendedBudgetQueue = require('./advCampaignRecommendedBudget/cron');

const schedule = [
  {
    job: cronCommissionQueue,
    payload: null,
    attempts: 2,
    cronTime: '0 12 * * *', // run daily at 8AM EST / 12PM UTC
    activated: process.env.RUN_CRON_AUTO_INVOICING_SCHEDULE,
  },
  {
    job: cronEmailQueue,
    payload: null,
    attempts: 2,
    cronTime: '0 18 * * *', // run daily at 2PM EST / 6PM UTC
    activated: process.env.RUN_CRON_AUTO_INVOICING_SCHEDULE,
  },
  {
    job: cronCollectQueue,
    payload: { status: 'Unpaid' },
    attempts: 2,
    cronTime: '0 13 * * *', // run daily at 9AM EST / 1PM UTC
    activated: process.env.RUN_CRON_AUTO_INVOICING_SCHEDULE,
  },
  {
    job: cronAdvCampaignRecommendedBudgetQueue,
    payload: null,
    attempts: 1,
    cronTime: '0 8 * * *', // run daily at 4AM EST / 8AM UTC
    activated: 'yes',
  },
  {
    job: syncInvoiceQueue,
    payload: null,
    attempts: 1,
    cronTime: '0 12 * * MON',
    activated: 'no',
  },
];

const initCronSchedule = () => {
  schedule
    .filter((i) => i.activated === 'yes')
    .forEach((queue) => {
      queue.job.add(queue.payload, {
        repeat: { cron: queue.cronTime },
        attempts: queue.attempts,
      });
    });
};

module.exports = { initCronSchedule };
