const moment = require('moment');
const puppeteer = require('puppeteer');

const { SyncRecord, SyncReport, Setting } = require('../../../models');

const { analyticsService } = require('@features/advertising/analytics');

const {
  campaignService,
  campaignRecordService,
} = require('@features/advertising/campaign');

const { uploadFile } = require('@services/s3.service');

const sleep = require('@utils/sleep');

const ReportRepository = require('@features/advertising/report/report.repository');

module.exports = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { reportId } = job.data;

    try {
      const report = await ReportRepository.findById(reportId, {
        include: ['advProfile.account'],
      });

      let data = { ...report.data };

      const dateRange = {
        startDate: report.startDate,
        endDate: report.endDate,
      };

      const { advProfile } = report;
      const { account } = advProfile;

      const initialSyncReport = await SyncReport.findOne({
        attributes: ['date'],
        where: { status: 'PROCESSED' },
        include: {
          model: SyncRecord,
          as: 'syncRecord',
          required: true,
          where: {
            dataType: 'advPerformanceReport',
          },
        },
        order: [['date', 'ASC']],
      });

      data.monthlyRecords = [];

      if (initialSyncReport && initialSyncReport.date) {
        const dateRef = moment(report.startDate);

        while (dateRef.isAfter(moment(initialSyncReport.date))) {
          const loopRef = dateRef.clone();

          data.monthlyRecords.push({
            dateRange: {
              startDate: loopRef.startOf('month').format('YYYY-MM-DD'),
              endDate: loopRef.endOf('month').format('YYYY-MM-DD'),
            },
          });

          dateRef.subtract(1, 'month');
        }
      }

      const spApiClient = await account.spApiClient('na');

      data.monthlyRecords = await Promise.all(
        data.monthlyRecords.map(async ({ dateRange }) => {
          const { startDate, endDate } = dateRange;

          const fStartDate = moment(startDate).utc().startOf('D').format();
          const fEndDate = moment(endDate).utc().endOf('D').format();
          const i = `${fStartDate}--${fEndDate}`;

          const response = await spApiClient.callAPI({
            endpoint: 'sales',
            operation: 'getOrderMetrics',
            query: {
              marketplaceIds: advProfile.marketplaceId,
              interval: i,
              granularity: 'Total',
              granularityTimeZone: advProfile.timezone,
            },
          });

          const { orderCount, totalSales } = response[0];

          const mrResponse =
            await campaignRecordService.getGroupedCampaignRecords(advProfile, {
              dateRange,
              attributes: ['roas', 'orders', 'acos', 'cost', 'cr'],
            });

          return {
            ...mrResponse.data,
            ...dateRange,
            totalOrderCount: orderCount,
            tacos:
              Math.round(
                (mrResponse.data.cost / totalSales.amount + Number.EPSILON) *
                  10000
              ) / 10000 || 0,
          };
        })
      );

      data.overallPerformance = await getOverallPerformance(
        advProfile,
        dateRange
      );

      const topCampaignsResponse = await campaignService.listCampaignsByProfile(
        advProfile,
        {
          page: 1,
          dateRange,
          pageSize: 10,
          pageOffset: 0,
          attributes: [
            'advCampaignId',
            'name',
            'cost',
            'sales',
            'acos',
            'orders',
          ],
          include: ['previousData'],
          sort: [['sales', 'desc']],
        }
      );

      data.topCampaigns = topCampaignsResponse.data.rows;

      await report.update({ data });

      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--font-render-hinting=none',
        ],
      });

      const page = await browser.newPage();

      const widthSetting = await Setting.findByPk(
        'advertising-analytics-export-pdf-width'
      );

      const heightSetting = await Setting.findByPk(
        'advertising-analytics-export-pdf-height'
      );

      await page.setViewport({
        width: parseInt(widthSetting.value),
        height: parseInt(heightSetting.value),
      });

      const baseUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://172.17.0.1'
          : process.env.AGENCY_URL;

      const reportsUrl = `${baseUrl}/reports-generator/monthly-report/${report.advReportId}`;

      await job.log(reportsUrl);

      await page.goto(reportsUrl, {
        waitUntil: 'networkidle0',
      });

      await sleep(5000);

      const body = await page.pdf({ format: 'A4' });
      await browser.close();

      const key = `reports/advertising/${report.advReportId}.pdf`;
      await uploadFile({ key, body });

      return resolve({ fileKey: key });
    } catch (error) {
      return reject(error);
    }
  });
};

const getOverallPerformance = async (advProfile, dateRange) => {
  const overallPerformanceResponse =
    await analyticsService.getPerformanceByAccountAndProfile(
      advProfile.account,
      advProfile,
      { dateRange, getDiffInMonth: true }
    );

  return overallPerformanceResponse.data;
};
