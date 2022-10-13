const Response = require('@utils/response');

const InitialSyncStatusRepository = require('./initialSyncStatus.repository');
const { AccountRepository } = require('../../account');
const { paginate } = require('@services/pagination.service');

/**
 * List initial sync status.
 *
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listInitialSyncStatus = async (options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await InitialSyncStatusRepository.findAndCountAll(
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Initial sync status successfully fetched.');
};

/**
 * Export initial sync status.
 *
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const exportInitialSyncStatus = async (options) => {
  const initialSyncStatus = await InitialSyncStatusRepository.findAll(options);

  const rows = initialSyncStatus.map((record) => {
    const row = record.toJSON();

    return {
      clientId: row.account.AgencyClient.agencyClientId,
      client: row.account.AgencyClient.client,
      accountId: row.account.accountId,
      accountName: row.account.name,
      sellingPartnerId: row.account.sellingPartnerId,
      spApiAuthorized: row.account.spApiAuthorized ? 'Yes' : 'No',
      advApiAuthorized: row.account.advApiAuthorized ? 'Yes' : 'No',
      inventory: row.inventory,
      orders: row.orders,
      financialEvents: row.financialEvents,
      products: row.products,
      reviews: row.reviews,
      inboundFBAShipments: row.inboundFBAShipments,
      inboundFBAShipmentItems: row.inboundFBAShipmentItems,
      advSnapshots: row.advSnapshots,
      advPerformanceReport: row.advPerformanceReport,
    };
  });

  return new Response()
    .withData(rows)
    .withMessage('All Initial sync status successfully fetched.');
};

/**
 *
 * @param {array} accountIds
 * @param {array} dataTypes
 * @returns
 */
const startInitialSync = async (accountIds, dataTypes) => {
  const accounts = await AccountRepository.findAllByAccountIds(accountIds, {
    include: ['credentials'],
  });

  await Promise.all(
    accounts.map(async (account) => {
      await Promise.all(
        dataTypes.map(async (dataType) => {
          await account.sync(dataType);
        })
      );
    })
  );

  return new Response().withMessage('Initial sync started.');
};

module.exports = {
  listInitialSyncStatus,
  exportInitialSyncStatus,
  startInitialSync,
};
