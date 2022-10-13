const { Account, InitialSyncStatus, SyncRecord } = require('./models');

const attrs = SyncRecord.DATA_TYPES;
const dataType = process.argv[2];

if (!dataType) {
  console.log('Error: Please specify specific dataType.');
  return;
}

const dataTypeAttr = attrs.find((attr) => attr.name == dataType);

if (!dataTypeAttr) {
  console.log('Error: Invalid Datatype.');
  return;
}

(async () => {
  const accounts = await Account.findAll({
    include: {
      model: InitialSyncStatus,
      as: 'initialSyncStatus',
      where: {
        [dataType]: 'COMPLETED',
      },
    },
  });

  for (const account of accounts) {
    console.log(`${account.accountId}: Adding cron sync for ${dataType}.`);
    await account.sync(dataTypeAttr.name, dataTypeAttr.syncType);
  }

  console.log(
    `\n* * * Selling Partners cron sync for ${dataType} has been added successfully. * * *`
  );

  process.exit();
})();
