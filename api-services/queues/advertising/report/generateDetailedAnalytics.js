const { analyticsService } = require('@features/advertising/analytics');
const { targetingService } = require('@features/advertising/targeting');

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

      data.performance = await getOverallPerformance(advProfile, dateRange);

      data.campaignSummary = await getCampaignSummary(advProfile, dateRange);

      data.campaignTypesBreakdown = await getCampaignTypesBreakdown(
        advProfile,
        dateRange
      );

      data.campaignTypeSummary = await getCampaignTypesPerformance(
        advProfile,
        dateRange
      );

      data.targetingTypeSummary = await getTargetingTypesPerformance(
        advProfile,
        dateRange
      );

      data.salesSummary = await getSalesSummary(advProfile, dateRange);

      data.convertersSummary = await getConvertersSummary(
        advProfile,
        dateRange
      );

      data.importantKeywords = await getImportantTargetings(
        advProfile,
        dateRange
      );

      await report.update({ data });

      return resolve({});
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
      { dateRange }
    );

  return overallPerformanceResponse.data;
};

const getCampaignTypesBreakdown = async (advProfile, dateRange) => {
  const campaignTypes = [
    { title: 'Sponsored Products', key: 'sponsoredProducts' },
    { title: 'Sponsored Brands', key: 'sponsoredBrands' },
    { title: 'Sponsored Display', key: 'sponsoredDisplay' },
  ];

  return await Promise.all(
    campaignTypes.map(async (campaignType) => {
      const response = await analyticsService.getPerformanceByProfile(
        advProfile,
        {
          dateRange,
          campaignType: campaignType.key,
          attributes: ['sales', 'acos', 'cost'],
        }
      );

      return { ...response.data, campaignType };
    })
  );
};

// getProfilePerformance
const getCampaignSummary = async (advProfile, dateRange) => {
  const campaignSummaryResponse =
    await analyticsService.getCampaignTypesSummary(advProfile, { dateRange });

  return campaignSummaryResponse.data;
};

const getCampaignTypesPerformance = async (advProfile, dateRange) => {
  const campaignTypesPerformanceResponse =
    await analyticsService.getProfilePerformanceByCampaignTypes(advProfile, {
      dateRange,
      attributes: [
        'cr',
        'cpc',
        'aov',
        'cost',
        'clicks',
        'orders',
        'acos',
        'sales',
      ],
    });

  return campaignTypesPerformanceResponse.data;
};

const getTargetingTypesPerformance = async (advProfile, dateRange) => {
  const targetingTypesPerformanceResponse =
    await analyticsService.getProfilePerformanceByTargetingTypes(advProfile, {
      dateRange,
      attributes: [
        'cr',
        'cpc',
        'aov',
        'cost',
        'clicks',
        'profit',
        'orders',
        'acos',
        'sales',
      ],
    });

  return targetingTypesPerformanceResponse.data;
};

const getSalesSummary = async (advProfile, dateRange) => {
  const salesSummaryResponse = await analyticsService.getSalesSummaryByProfile(
    advProfile,
    { dateRange }
  );

  return salesSummaryResponse.data;
};

const getConvertersSummary = async (advProfile, dateRange) => {
  const convertersSummaryResponse = await targetingService.getConvertersSummary(
    advProfile,
    { dateRange }
  );

  return convertersSummaryResponse.data;
};

const getImportantTargetings = async (advProfile, dateRange) => {
  let targetings = [
    { key: 'Most Sales', metric: 'sales', order: 'desc' },
    { key: 'Most Spend', metric: 'cost', order: 'desc' },
    { key: 'Lowest ACoS', metric: 'acos', order: 'asc' },
    { key: 'Highest ACoS', metric: 'acos', order: 'desc' },
  ];

  targetings = await Promise.all(
    targetings.map(async (targeting) => {
      const convertersSummaryResponse =
        await targetingService.listTargetingsByProfile(advProfile, {
          dateRange,
          page: 1,
          pageSize: 1,
          attributes: [
            'value',
            'cost',
            'sales',
            'impressions',
            'clicks',
            'orders',
            'unitsSold',
            'ctr',
            'cr',
            'acos',
            'cpm',
            'cpc',
            'cpcon',
          ],
          sort: [[targeting.metric, targeting.order]],
          include: [],
        });

      return convertersSummaryResponse.data.count
        ? { ...convertersSummaryResponse.data.rows[0], key: targeting.key }
        : { key: targeting.key };
    })
  );

  return targetings;
};
