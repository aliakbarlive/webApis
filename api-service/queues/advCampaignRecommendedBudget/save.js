'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const { pick } = require('lodash');
const { Op } = require('sequelize');
const {
  AdvProfile,
  AdvCampaign,
  AdvCampaignBudgetRecommendation,
} = require('../../models');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Adv. Campaign Recommended Budget - Save', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(1, async (job) => {
    const { advProfileId } = job.data;
    const campaignType = 'sponsoredProducts';

    return new Promise(async (resolve, reject) => {
      try {
        const advProfile = await AdvProfile.findByPk(advProfileId);
        const apiClient = await advProfile.apiClient();

        const limit = 100;
        let cont = true;
        let offset = 0;

        while (cont) {
          const { rows, count } = await AdvCampaign.findAndCountAll({
            attributes: ['advCampaignId'],
            where: { advProfileId, campaignType },
            offset,
            limit,
          });

          if (count) {
            const campaignIds = rows.map((r) => r.advCampaignId);

            const response = await apiClient.getCampaignRecommendations(
              campaignType,
              { campaignIds }
            );

            if (
              'budgetRecommendationsSuccessResults' in response &&
              response.budgetRecommendationsSuccessResults.length
            ) {
              await AdvCampaignBudgetRecommendation.destroy({
                where: { advCampaignId: { [Op.in]: campaignIds } },
              });

              const data = await response.budgetRecommendationsSuccessResults
                .filter((br) => br.suggestedBudget)
                .map((br) =>
                  pick({ ...br, advCampaignId: br.campaignId }, [
                    'advCampaignId',
                    'suggestedBudget',
                    'sevenDaysMissedOpportunities',
                  ])
                );

              if (data.length) {
                await AdvCampaignBudgetRecommendation.bulkCreate(data);
              }
            }
          }

          offset = offset + count;
          cont = count === limit;
        }

        return resolve({ count: offset });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async (job) => {
    console.log(`adv-campaign-recommended-budget-save-completed`);
  });

  queue.on('failed', function (job, result) {
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log(err);
  });

  queue.on('active', function (job, err) {
    console.log(`adv-campaign-recommended-budget-save-active`);
  });
}

module.exports = queue;
