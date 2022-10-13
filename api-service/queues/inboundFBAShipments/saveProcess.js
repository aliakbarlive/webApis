const sleep = require('../../utils/sleep');

const { SpRequest, SyncRecord, InboundFBAShipment } = require('../../models');

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

    const ShipmentStatusList = [
      'WORKING',
      'SHIPPED',
      'CLOSED',
      'RECEIVING',
      'CANCELLED',
      'DELETED',
      'ERROR',
      'IN_TRANSIT',
      'DELIVERED',
      'CHECKED_IN',
    ];

    let NextToken = true;
    let page = 1;
    while (NextToken) {
      const fetchingNextPage = typeof NextToken == 'string';

      // Request SP-API for inbound FBA shipments.
      const shipments = await spApiClient.callAPI({
        operation: 'getShipments',
        query: {
          QueryType: fetchingNextPage ? 'NEXT_TOKEN' : 'DATE_RANGE',
          LastUpdatedAfter: fetchingNextPage ? null : spRequest.startDate,
          LastUpdatedBefore: fetchingNextPage ? null : spRequest.endDate,
          NextToken: fetchingNextPage ? NextToken : null,
          ShipmentStatusList,
          MarketplaceId: 'invalid parameter',
        },
      });

      const { ShipmentData } = shipments;
      const count = Array.isArray(ShipmentData) ? ShipmentData.length : 0;

      await spRequest.update({
        message: `Saving ${count} records of page ${page}.`,
      });

      await saveInboundShipments(account.accountId, ShipmentData);

      NextToken = ShipmentData.NextToken ?? false;

      if (NextToken) page++;
    }

    return done(null, { spRequestId, totalPage: page });
  } catch (err) {
    return done(err);
  }
};

/**
 * Save inbound shipments to database.
 *
 * @param array records
 * @returns Promise
 */
const saveInboundShipments = async (accountId, shipments) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const shipment of shipments) {
        const {
          ShipmentId: inboundFBAShipmentId,
          ShipmentName: inboundFBAShipmentName,
          ShipFromAddress: shipFromAddress,
          DestinationFulfillmentCenterId: destinationFulfillmentCenterId,
          ShipmentStatus: inboundFBAShipmentStatus,
          LabelPrepType: labelPrepType,
          AreCasesRequired: areCasesRequired,
          BoxContentsSource: boxContentsSource,
        } = shipment;

        await InboundFBAShipment.upsert({
          accountId,
          inboundFBAShipmentId,
          inboundFBAShipmentName,
          shipFromAddress,
          destinationFulfillmentCenterId,
          inboundFBAShipmentStatus,
          labelPrepType,
          areCasesRequired,
          boxContentsSource,
        });
      }

      return resolve(shipments);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = saveProcess;
