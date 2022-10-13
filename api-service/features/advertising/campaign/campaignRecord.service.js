const Response = require('@utils/response');
const {
  getWeeksBetweenDateRange,
  getDateRangeSummary,
} = require('../utils/dateRange');

const CampaignRecordRepository = require('./campaignRecord.repository');

/**
 * Get campaign records by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getCampaignRecordsByProfile = async (profile, options) => {
  const data = await CampaignRecordRepository.findAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(data)
    .withMessage('Campaign records successfully fetched.');
};

/**
 * Get campaign records by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getGroupedCampaignRecords = async (profile, options) => {
  const data = await CampaignRecordRepository.findSumByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(data)
    .withMessage('Campaign records successfully fetched.');
};

/**
 * Get campaign records by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getWeeklyCampaignRecordsByProfile = async (profile, options) => {
  const { startDate } = options.dateRange;

  let records = getWeeksBetweenDateRange(startDate);

  records = await Promise.all(
    records.map(async ({ startDate, endDate }, index) => {
      const data = await CampaignRecordRepository.findSumByProfileId(
        profile.advProfileId,
        { ...options, dateRange: { startDate, endDate } }
      );

      return data
        ? { ...data, date: `Week ${index + 1}` }
        : { date: `Week ${index + 1}` };
    })
  );

  return new Response()
    .withData(records)
    .withMessage('Campaign records successfully fetched.');
};

/**
 * Get campaign records by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getCampaignPerformance = async (profile, options) => {
  const { dateRange } = options;
  let records = getDateRangeSummary(dateRange);

  records = await Promise.all(
    records.map(async ({ startDate, endDate }) => {
      const data = await CampaignRecordRepository.findSumByProfileId(
        profile.advProfileId,
        { ...options, dateRange: { startDate, endDate } }
      );

      return { ...data, startDate, endDate };
    })
  );

  return new Response()
    .withData(records)
    .withMessage('Campaign records successfully fetched.');
};

module.exports = {
  getCampaignPerformance,
  getCampaignRecordsByProfile,
  getWeeklyCampaignRecordsByProfile,
  getGroupedCampaignRecords,
};
