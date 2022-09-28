const sleep = require('../../utils/sleep');

const {
  SpRequest,
  SyncRecord,
  InboundFBAShipmentItem,
} = require('../../models');

const saveProcess = async (job, done) => {
  const { spRequestId } = job.data;

  try {
    await sleep(1000);

    const spRequest = await SpRequest.findByPk(spRequestId, {
      include: {
        model: SyncRecord,
        as: 'syncRecord',
      },
    });

    const account = await spRequest.syncRecord.getAccount();
    const spApiClient = await account.spApiClient('na');

    let NextToken = true;
    let page = 1;

    while (NextToken) {
      const fetchingNextPage = typeof NextToken == 'string';

      // Request SP-API for inbound FBA shipment items
      const shipmentItems = await spApiClient.callAPI({
        operation: 'getShipmentItems',
        query: {
          QueryType: fetchingNextPage ? 'NEXT_TOKEN' : 'DATE_RANGE',
          LastUpdatedAfter: fetchingNextPage ? null : spRequest.startDate,
          LastUpdatedBefore: fetchingNextPage ? null : spRequest.endDate,
          NextToken: fetchingNextPage ? NextToken : null,
          MarketplaceId: 'invalid parameter',
        },
      });

      const { ItemData } = shipmentItems;
      const count = Array.isArray(ItemData) ? ItemData.length : 0;

      await spRequest.update({
        message: `Saving ${count} records of page ${page}.`,
      });

      await saveInboundShipmentItems(account.accountId, ItemData);

      NextToken = shipmentItems.NextToken ?? false;
      if (NextToken) page++;
    }

    return done(null, { spRequestId, totalPage: page });
  } catch (err) {
    return done(err);
  }
};

/**
 * Save inbound shipment items to database.
 *
 * @param array records
 * @returns Promise
 */
const saveInboundShipmentItems = async (accountId, shipmentItems) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const item of shipmentItems) {
        const {
          ShipmentId: inboundFBAShipmentId,
          SellerSKU: sellerSku,
          FulfillmentNetworkSKU: fulfillmentNetworkSku,
          QuantityShipped: quantityShipped,
          QuantityReceived: quantityReceived,
          QuantityInCase: quantityInCase,
          PrepDetailsList: prepDetailsList,
        } = item;

        await InboundFBAShipmentItem.upsert({
          inboundFBAShipmentId,
          sellerSku,
          fulfillmentNetworkSku,
          quantityShipped,
          quantityReceived,
          quantityInCase,
          prepDetailsList,
        });
      }

      return resolve(shipmentItems);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = saveProcess;
