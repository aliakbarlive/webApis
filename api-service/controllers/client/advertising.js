const { Parser } = require('json2csv');

const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');

const { getAdvCampaigns } = require('../../services/advCampaign.service');
const { getAdvAdGroups } = require('../../services/advAdGroup.service');
const { getAdvKeywords } = require('../../services/advKeyword.service');
const { getAdvTargets } = require('../../services/advTarget.service');
const { getAdvProductAds } = require('../../services/advProductAd.service');
const { getAdvSearchTerms } = require('../../services/advSearchTerm.service');

// @desc     Export advertising data.
// @route    GET /api/v1/ppc/export
// @access   Private
exports.exportData = asyncHandler(async (req, res, next) => {
  const { recordType, campaignType } = req.query.filter;
  const { advProfileId } = req.advProfile;

  const services = {
    campaigns: getAdvCampaigns,
    adGroups: getAdvAdGroups,
    keywords: getAdvKeywords,
    targets: getAdvTargets,
    productAds: getAdvProductAds,
    searchTerms: getAdvSearchTerms,
  };

  const { rows, count } = await services[recordType](
    advProfileId,
    req.query,
    true
  );

  if (!count) {
    throw new ErrorResponse('No data found', 400);
  }

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(rows);

  res.header('Content-Type', 'text/csv');
  res.attachment(`${campaignType}-${recordType}.csv`);
  return res.send(csv);
});
