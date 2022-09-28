const moment = require('moment');
const { SyncRecord, SpRequest } = require('../../models');
const saveInboundFBAShipments = require('./save');

const requestProcess = async (job, done) => {
  // Will get sellingPartnerId value from afterCreate hook of InitialSyncStatus model
  const { accountId, syncType } = job.data;

  try {
    const endDate = moment().toISOString();
    const startDate = await getStartDate(accountId, syncType);

    // Create initial syncRecord record
    const { syncRecordId } = await SyncRecord.create({
      accountId,
      pendingReports: 1,
      totalReports: 1,
      syncType,
      dataType: 'inboundFBAShipments',
      status: 'REQUESTING',
      syncDate: endDate,
    });

    // Create spRequest record
    const spRequest = await SpRequest.create({
      syncRecordId,
      status: 'PENDING',
      startDate,
      endDate,
    });

    // Add job to saveInboundFBAShipment.js
    const saveJob = await saveInboundFBAShipments.add(
      {
        spRequestId: spRequest.spRequestId,
      },
      { attempts: 3, backoff: 1000 * 60 * 1 }
    );

    await spRequest.update({
      jobId: saveJob.id,
      message: 'Fetching records pending on queue.',
    });

    done(null, {});
  } catch (err) {
    done(new Error(err.message));
    console.log(err);
  }
};

const getStartDate = async (accountId, syncType) => {
  if (syncType == 'initial')
    return moment(process.env.INITIAL_SYNC_DATE).toISOString();

  const { syncDate } = await SyncRecord.findOne({
    where: {
      accountId,
      dataType: 'inboundFBAShipments',
      status: 'COMPLETED',
    },
    order: [['createdAt', 'DESC']],
  });

  return moment(syncDate).toISOString();
};

module.exports = requestProcess;
