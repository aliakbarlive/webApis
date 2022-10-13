const { pick } = require('lodash');
const Response = require('@utils/response');
const ReportRepository = require('./report.repository');

const { paginate } = require('@services/pagination.service');
const { AgencyClientRepository } = require('@features/agencyClient');

const generateReportQueue = require('@queues/advertising/report/generate');

/**
 * Create export.
 *
 * @param {object} data
 * @returns {Promise<Response>}
 */
exports.createReport = async (data) => {
  const client = await AgencyClientRepository.findByAccountId(data.accountId);

  const report = await ReportRepository.create(
    pick(
      { ...data, clientId: client.agencyClientId },
      ReportRepository.getAttributes()
    )
  );

  await generateReportQueue.add(report.type, { reportId: report.advReportId });

  return new Response()
    .withData(report)
    .withMessage('Report successfully created.');
};

exports.listReportByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await ReportRepository.findAndCountAll({
    ...options,
    advProfileId: profile.advProfileId,
  });

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Reports successfully fetched.');
};

exports.getReportById = async (reportId) => {
  const report = await ReportRepository.findById(reportId, {
    include: ['advProfile.account', 'client'],
  });

  if (!report) {
    return new Response().failed().withCode(404).withMessage('Not found');
  }

  return new Response()
    .withData(report)
    .withMessage('Report successfully fetched.');
};
