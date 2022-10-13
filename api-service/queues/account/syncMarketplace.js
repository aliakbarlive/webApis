'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const { Account, Credential } = require('../../models');
const { syncAccountMarketplace } = require('../../services/account.service');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Account Sync Marketplace', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(async (job) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { rows, count } = await Account.findAndCountAll({
          include: {
            model: Credential,
            as: 'credentials',
            where: {
              service: 'spApi',
            },
          },
        });

        for (const account of rows) {
          const spApiClient = await account.spApiClient('na');

          const marketplaces = await spApiClient.callAPI({
            operation: 'getMarketplaceParticipations',
          });

          await syncAccountMarketplace(account.accountId, marketplaces);
        }

        return resolve({ count });
      } catch (error) {
        return reject(error);
      }
    });
  });
}

module.exports = queue;
