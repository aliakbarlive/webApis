const { pick, keys } = require('lodash');
const Response = require('@utils/response');

const { getAdvKeywords } = require('@services/advKeyword.service');
const { getAdvCampaigns } = require('@services/advCampaign.service');
const { getAdvSearchTerms } = require('@services/advSearchTerm.service');
const { paginate } = require('@services/pagination.service');

const { KeywordRepository } = require('../keyword');
const { CampaignRepository } = require('../campaign');
const { SearchTermRepository } = require('../searchTerm');
const { metricService } = require('../metric');

const OptimizationReportRepository = require('./optimizationReport.repository');
const OptimizationReportItemRepository = require('./optimizationReportItem.repository');

/**
 * Get optimization report items.
 *
 * @param {AdvProfile} profile
 * @param {uuid} reportId
 * @param {object} query
 * @returns {Promsise<Response>} response
 */
const listReportItems = async (profile, reportId, query) => {
  const report = await OptimizationReportRepository.findByProfileIdAndId(
    profile.advProfileId,
    reportId,
    { include: ['rules'] }
  );

  if (!report) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Optimization report not found.');
  }

  const items = await generateOptimizationReportItems(report, query);

  return new Response()
    .withCode(200)
    .withData(items)
    .withMessage('Optimization report successfully generated.');
};

const generateOptimizationReportItems = async (report, query) => {
  const { campaignType, startDate, endDate, rules, advProfileId } = report;
  const { page, pageSize, pageOffset, sort } = query;

  let target = '';
  let options = {
    sort,
    page,
    pageSize,
    pageOffset,
    include: ['previousData'],
    filter: { campaignType, rules },
    dateRange: { startDate, endDate },
  };

  if (query.filter.target) {
    options.filter.target = query.filter.target;
  }

  if (query.filter.matchType) {
    options.filter.matchType = query.filter.matchType;
  }

  const generator = getRecordTypeGenerator(report.recordType);

  const { rows, count } = await generator.getList(advProfileId, {
    ...options,
    attributes:
      generator.attributes.join(',') +
      ',' +
      'impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,unitsSold,roas,attributedUnitsOrdered30d,attributedSales30d',
  });

  const records = rows.map((row) => {
    const itemAttrs = OptimizationReportItemRepository.getAttributes();

    const valuesAttr = keys(row)
      .filter((key) => !itemAttrs.includes(key))
      .filter((key) => key !== 'reportRules');

    const identifier = row[generator.key];
    const key = `OPTMZTN${report.advOptimizationReportId}-${identifier}`;

    return {
      ...pick(generator.mapping ? generator.mapping(row) : row, itemAttrs),
      values: pick(row, valuesAttr),
      advOptimizationReportItemId: key,
      advOptimizationReportId: report.advOptimizationReportId,
      options: row.reportRules.map((reportRuleId) => {
        return {
          advOptimizationReportItemOptionId: `OPTMZTN${report.advOptimizationReportId}R${reportRuleId}-${identifier}`,
          advOptimizationReportRuleId: reportRuleId,
        };
      }),
    };
  });

  const items = await OptimizationReportItemRepository.bulkCreateWithOptions(
    records
  );

  const freshItems = await OptimizationReportItemRepository.findAllByIds(
    items.map((i) => i.advOptimizationReportItemId),
    { include: ['options'] }
  );

  let sortedItems = [];

  items.forEach((item) => {
    const refItem = freshItems.find(
      (fi) =>
        fi.advOptimizationReportItemId === item.advOptimizationReportItemId
    );

    sortedItems.push(refItem);
  });

  return paginate(sortedItems, count, page, pageOffset, pageSize);
};

const getRecordTypeGenerator = (recordType) => {
  const generators = {
    keywords: {
      key: 'advKeywordId',
      attributes: KeywordRepository.getAttributes(),
      getList: getAdvKeywords,
      mapping: (row) => {
        row.advCampaignId = row.AdvAdGroup.AdvCampaign.advCampaignId;
        return row;
      },
    },
    campaigns: {
      key: 'advCampaignId',
      attributes: CampaignRepository.getAttributes(),
      getList: getAdvCampaigns,
    },
    searchTerms: {
      key: 'advSearchTermId',
      attributes: SearchTermRepository.getAttributes(),
      getList: getAdvSearchTerms,
    },
  };

  return generators[recordType];
};

module.exports = {
  listReportItems,
};
