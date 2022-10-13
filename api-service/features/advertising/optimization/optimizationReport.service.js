const { startCase, upperFirst } = require('lodash');
const { RuleRepository } = require('../rule');

const { AgencyClientRepository } = require('@features/agencyClient');

const OptimizationBatchRepository = require('./optimizationBatch.repository');
const OptimizationReportRepository = require('./optimizationReport.repository');
const OptimizationReportItemOptionRepository = require('./optimizationReportItemOption.repository');
const ChangeRequestRepository = require('../changeRequest/changeRequest.repository');

const { processBatchOptimization } = require('./optimizationBatch.service');

const { CHANGE_REQUEST_TYPE_OPTIMIZATION } = require('@utils/constants');

const Response = require('@utils/response');

/**
 * Generate optimization report.
 *
 * @param {User} user
 * @param {AdvProfile} profile
 * @param {object} body
 * @returns {Promsise<Response>} response
 */
const generateOptimizationReport = async (user, profile, body) => {
  const { advProfileId } = profile;
  const { accountId, campaignType, recordType, ruleIds } = body;

  const rules = await RuleRepository.getByAccountIdCampaignTypeRecordTypeAndIds(
    accountId,
    campaignType,
    recordType,
    ruleIds
  );

  if (rules.length !== ruleIds.length) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Failed to generate report with specified rules.');
  }

  const report = await OptimizationReportRepository.createWithRule({
    generatedByUserId: user.userId,
    startDate: body.startDate,
    endDate: body.endDate,
    advProfileId,
    campaignType,
    recordType,
    rules: rules.map((rule) => {
      return {
        name: rule.name,
        filters: rule.filters,
        products: rule.products,
        advRuleId: rule.advRuleId,
        campaigns: rule.campaigns,
        portfolios: rule.portfolios,
        actionData: rule.actionData,
        advRuleActionId: rule.advRuleActionId,
      };
    }),
  });

  return new Response()
    .withCode(200)
    .withData(report)
    .withMessage('Optimization report successfully generated.');
};

/**
 * Process optimization report.
 *
 * @param {User} user
 * @param {AdvProfile} profile
 * @param {object} body
 * @returns {Promsise<Response>} response
 */
const processOptimizationReport = async (user, profile, reportId) => {
  const { advProfileId, accountId } = profile;
  const report = await OptimizationReportRepository.findByProfileIdAndId(
    advProfileId,
    reportId
  );

  if (!report) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Optimization report not found.');
  }

  if (report.generatedByUserId !== user.userId) {
    return new Response().failed().withCode(403).withMessage('Forbidden');
  }

  const options =
    await OptimizationReportItemOptionRepository.findAllSelectedByReportId(
      reportId
    );

  if (!options.length) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Optimization report does`nt have selected item options');
  }

  const client = await AgencyClientRepository.findByAccountId(accountId);

  const { generatedByUserId, recordType } = report;
  const dateRange = `${report.startDate} - ${report.endDate}`;

  // Create Optimization Batch
  const batch = await OptimizationBatchRepository.createWithOptimizations({
    advOptimizationReportId: report.advOptimizationReportId,
    campaignType: report.campaignType,
    recordType: report.recordType,
    startDate: report.startDate,
    userId: generatedByUserId,
    endDate: report.endDate,
    advProfileId,
    optimizations: options.map((option) => {
      return {
        advOptimizationReportItemId: option.advOptimizationReportItemId,
        advOptimizationReportRuleId: option.advOptimizationReportRuleId,
        optimizableType: report.recordType.slice(0, -1),
        optimizableId:
          option.item[`adv${upperFirst(report.recordType.slice(0, -1))}Id`],
        data: {
          ...option.data,
          ...option.rule.actionData,
        },
      };
    }),
  });

  let changeRequest = null;

  if (
    user.role.permissions.some(
      (p) => p.access === 'ppc.optimization.requireApproval'
    )
  ) {
    changeRequest = await ChangeRequestRepository.createWithItems({
      advProfileId,
      requestedAt: new Date(),
      requestedBy: generatedByUserId,
      clientId: client.agencyClientId,
      type: CHANGE_REQUEST_TYPE_OPTIMIZATION,
      description: `${startCase(recordType)} Optimization. (${dateRange})`,
      items: batch.optimizations.map((optimization) => {
        return {
          advOptimizationId: optimization.advOptimizationId,
          data: {},
        };
      }),
    });

    await batch.update({
      advChangeRequestId: changeRequest.advChangeRequestId,
    });
  }

  // Reset Options
  const optionIds = options.map((o) => o.advOptimizationReportItemOptionId);
  await OptimizationReportItemOptionRepository.resetByIds(optionIds);

  if (changeRequest) {
    return new Response()
      .withCode(200)
      .withData(batch)
      .withMessage('Optimization items successfully added for approval.');
  }

  return await processBatchOptimization(batch.advOptimizationBatchId);
};

/**
 *
 * @param {AdvProfile} profile
 * @param {bigint} reportId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getOptimizationReport = async (profile, reportId, options = {}) => {
  const report = await OptimizationReportRepository.findByProfileIdAndId(
    profile.advProfileId,
    reportId,
    options
  );

  if (!report) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Optimization report not found.');
  }

  return new Response()
    .withCode(200)
    .withData(report)
    .withMessage('Optimization report successfully fetched.');
};

module.exports = {
  generateOptimizationReport,
  processOptimizationReport,
  getOptimizationReport,
};
