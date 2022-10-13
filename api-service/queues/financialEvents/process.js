const sleep = require('../../utils/sleep');
const saveFinancialEvents = require('./saveFinancialEvents');
const wtf8 = require('wtf-8');
const { SpRequest, SyncRecord } = require('../../models');

// For removing unwanted characters
const remove_non_ascii = (str) => {
  if (str === null || str === '') return false;
  else str = str.toString();

  return str.replace(/[^\x20-\x7E]/g, '');
};

module.exports = async (job) => {
  const { spRequestId } = job.data;

  let res_debug = {};
  try {
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
      // avoid exceeding quota for requesting resource
      await sleep(2000);

      const query =
        typeof NextToken == 'string'
          ? { NextToken }
          : {
              PostedAfter: spRequest.startDate,
              PostedBefore: spRequest.endDate,
            };

      // Get the financial events
      const response = await spApiClient.callAPI({
        operation: 'listFinancialEvents',
        query,
        options: {
          raw_result: true,
        },
      });

      res_debug = response.body.replace(/\n/g, '');
      if (res_debug != '') {
        // Prepare the reponse
        res_debug = wtf8.encode(res_debug);
        res_debug = remove_non_ascii(res_debug).replace(/\\/g, '');

        // Parse the response
        const body = JSON.parse(res_debug);
        const { payload } = body;

        if (payload) {
          const { FinancialEvents } = payload;
          if (FinancialEvents) {
            // Store Financial Events
            await saveFinancialEvents(
              FinancialEvents,
              account.accountId,
              page,
              spRequestId
            );
          }

          NextToken = payload.NextToken;
          if (NextToken) page++;
        } else {
          return Promise.reject(new Error(body.errors[0].message));
        }
      }
    }

    return Promise.resolve({ spRequestId, totalPage: page });
  } catch (e) {
    console.log('Response: ');
    console.log(res_debug);
    console.log('Error: ');
    console.log(e);
    return Promise.reject(new Error('Something went wrong! retrying!!'));
  }
};
