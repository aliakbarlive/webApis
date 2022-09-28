const { InitialSyncStatus } = require('../models');

/**
 * Get initial sync status by accountId.
 *
 * @param uuid accountId
 * @returns object
 */
const getInitialSyncStatusByAccountId = async (accountId) => {
  const initialSyncStatus = await InitialSyncStatus.findOne({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'accountId'],
    },
    where: { accountId },
  });

  return initialSyncStatus;
};

module.exports = { getInitialSyncStatusByAccountId };
