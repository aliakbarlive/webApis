const moment = require('moment');

const { AgencyClientRepository } = require('@features/agencyClient');

const CampaignRepository = require('./campaign.repository');
const ChangeRequestRepository = require('../changeRequest/changeRequest.repository');

const { bulkSyncAdvCampaigns } = require('@services/advCampaign.service');

const saveHistory = require('../../../queues/advSnapshots/saveHistory');

const Response = require('@utils/response');
const {
  SUCCESS,
  CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET,
  CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY,
} = require('@utils/constants');

/**
 * List Campaigns by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listCampaignsByProfile = async (profile, options) => {
  const list = await CampaignRepository.findAndCountAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(list)
    .withMessage('Campaigns successfully fetched.');
};

/**
 * Update single advertising campaign.
 *
 * @param {User} user
 * @param {AdvProfile} profile
 * @param {bigint} campaignId
 * @param {object} data
 *
 * @returns {Promise<Response>} result
 */
const updateSingleCampaign = async (user, profile, campaignId, data) => {
  const { advProfileId, accountId } = profile;

  const campaign = await CampaignRepository.findByProfileIdAndId(
    advProfileId,
    campaignId
  );

  if (!campaign) {
    return new Response()
      .failed()
      .withCode(404)
      .withMessage('Campaign not found.');
  }

  const needApproval = user.role.permissions.some(
    (p) => p.access === 'ppc.campaign.updateDailyBudget.requireApproval'
  );

  if (needApproval) {
    const client = await AgencyClientRepository.findByAccountId(accountId);

    await ChangeRequestRepository.createWithItems({
      advProfileId,
      requestedAt: new Date(),
      requestedBy: user.userId,
      clientId: client.agencyClientId,
      type: CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY,
      description: 'Update campaign daily budget',
      items: [
        {
          advCampaignId: campaign.advCampaignId,
          data: { ...data, campaignId: campaign.advCampaignId },
        },
      ],
    });

    return new Response().withMessage('Items successfully added for approval.');
  }

  const { campaignType } = campaign;
  const result = await processUpdateCampaigns(user, profile, campaignType, [
    { ...data, campaignId },
  ]);

  return result;
};

/**
 * Apply Campaigns recommended budget.
 *
 * @param {User} user
 * @param {AdvProfile} profile
 * @param {object} body
 *
 * @returns {Promise<Response>} result
 */
const applyCampaignsRecommendedBudget = async (user, profile, body) => {
  const { advProfileId, accountId } = profile;
  const { campaignIds, campaignType } = body;

  const campaigns =
    await CampaignRepository.findByProfileIdCampaignTypeAndIdsWithBudgetRecommendation(
      advProfileId,
      campaignType,
      campaignIds
    );

  if (campaigns.length !== campaignIds.length) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage(
        'Some campaigns cannot be found or doesnt have budget recommendation.'
      );
  }

  const needApproval = user.role.permissions.some(
    (p) => p.access === 'ppc.campaign.applyRecommendedBudget.requireApproval'
  );

  if (needApproval) {
    const client = await AgencyClientRepository.findByAccountId(accountId);
    const date = moment().format('MMMM Do YYYY');

    await ChangeRequestRepository.createWithItems({
      advProfileId,
      requestedAt: new Date(),
      requestedBy: user.userId,
      clientId: client.agencyClientId,
      type: CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET,
      description: `Apply campaign(s) recommended budget as of ${date}`,
      items: campaigns.map((campaign) => {
        return {
          advCampaignId: campaign.advCampaignId,
          data: {
            campaignId: campaign.advCampaignId,
            dailyBudget: campaign.budgetRecommendation.suggestedBudget,
          },
        };
      }),
    });

    return new Response().withMessage('Items successfully added for approval.');
  }

  const result = await processUpdateCampaigns(
    user,
    profile,
    campaignType,
    campaigns.map((campaign) => {
      return {
        campaignId: campaign.advCampaignId,
        dailyBudget: campaign.budgetRecommendation.suggestedBudget,
      };
    })
  );

  return result;
};

/**
 * Process update campaigns.
 *
 * @param {User} user
 * @param {AdvProfile} profile
 * @param {string} campaignType
 * @param {object} payload
 *
 * @returns {Promise<Response>} result
 */
const processUpdateCampaigns = async (user, profile, campaignType, payload) => {
  try {
    const fromDate = moment().utc().valueOf();
    const apiClient = await profile.apiClient();

    const response = await apiClient.updateCampaigns(campaignType, payload);

    const toDate = moment().utc().add(10, 's').valueOf();

    if (response.some((r) => r.code === SUCCESS)) {
      const params = {
        campaignIdFilter: response
          .filter((r) => r.code === SUCCESS)
          .map((r) => r.campaignId)
          .join(','),
      };

      const campaignsCollection = await apiClient.listCampaigns(
        campaignType,
        params,
        true
      );

      await bulkSyncAdvCampaigns(
        profile.advProfileId,
        campaignType,
        campaignsCollection,
        user.userId,
        false
      );

      await saveHistory.add(
        'manual',
        {
          advProfileId: profile.advProfileId,
          fromDate,
          toDate,
          userId: user.userId,
          payload: {
            fromDate,
            toDate,
            sort: { key: 'DATE', direction: 'DESC' },
            eventTypes: {
              CAMPAIGN: {
                eventTypeIds: response
                  .filter((r) => r.code === SUCCESS)
                  .map((r) => r.campaignId.toString()),
              },
            },
            filters: ['BUDGET_AMOUNT'],
          },
        },
        {
          delay: 1000 * 60,
        }
      );

      return new Response().withMessage('Campaigns successfully updated.');
    }

    return new Response()
      .failed()
      .withCode(500)
      .withMessage('Failed to update campaigns.');
  } catch (error) {
    console.log(error);
    return new Response()
      .failed()
      .withCode(500)
      .withMessage('Whoops! Something went wrong!');
  }
};

module.exports = {
  updateSingleCampaign,
  listCampaignsByProfile,
  processUpdateCampaigns,
  applyCampaignsRecommendedBudget,
};
