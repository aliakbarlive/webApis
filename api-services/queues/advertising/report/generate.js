'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });

const generateAnalytics = require('./generateAnalytics');
const generateDetailedAnalytics = require('./generateDetailedAnalytics');

const ReportRepository = require('@features/advertising/report/report.repository');

let queue = new Queue('Adv. Reports - Generate', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 1200000,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process('analytics', 10, generateAnalytics);
  queue.process('interactive-analytics', 10, generateDetailedAnalytics);

  queue.on('completed', async function (job, result) {
    const { reportId: advReportId } = job.data;

    await ReportRepository.update(
      { status: 'completed', downloadUrl: job.returnvalue.fileKey },
      { where: { advReportId } }
    );
  });

  queue.on('failed', async function (job, result) {
    const { reportId: advReportId } = job.data;

    await ReportRepository.update(
      { status: 'failed' },
      { where: { advReportId } }
    );
  });

  queue.on('active', async function (job, err) {
    const { reportId: advReportId } = job.data;

    await ReportRepository.update(
      { status: 'processing' },
      { where: { advReportId } }
    );
  });

  queue.on('error', function (err) {
    console.log(err);
  });
}

module.exports = queue;
