const moment = require('moment');

const { SyncRecord, SpRequest } = require('../../models');
const saveInboundFBAShipmentItems = require('./save');

const requestProcess = async (job, done) => {
  const { accountId, syncType } = job.data;

  try {
    const startDate = await getStartDate(accountId, syncType);
    const endDate = moment().toISOString();

    // Create initial syncRecord record
    const { syncRecordId } = await SyncRecord.create({
      dataType: 'inboundFBAShipmentItems',
      status: 'REQUESTING',
      syncDate: endDate,
      pendingReports: 1,
      totalReports: 1,
      accountId,
      syncType,
    });

    // Create spRequest record
    const spRequest = await SpRequest.create({
      syncRecordId,
      status: 'PENDING',
      startDate,
      endDate,
    });

    // Add job to saveInboundFBAShipmentItems.js
    const saveJob = await saveInboundFBAShipmentItems.add(
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
      dataType: 'inboundFBAShipmentItems',
      status: 'COMPLETED',
    },
    order: [['createdAt', 'DESC']],
  });

  return moment(syncDate).toISOString();
};

module.exports = requestProcess;
