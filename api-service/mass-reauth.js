const dotenv = require('dotenv');
const {
  sequelize,
  AgencyClient,
  User,
  Account,
  Subscription,
  Credential,
} = require('./models');
const { Op, col, where } = require('sequelize');
const { sendReauthEmail } = require('./services/email.service');

//const { sendEmail } = require('./services/clientMigrationService');

const getClients = async () => {
  let options = {
    attributes: ['agencyClientId', 'client', 'status'],
    include: [
      {
        model: User,
        as: 'defaultContact',
        attributes: ['email'],
      },
      {
        model: Account,
        as: 'account',
        attributes: ['planId'],
        include: [
          {
            model: Subscription,
            as: 'subscription',
            attributes: ['status'],
            where: { status: { [Op.in]: ['live', 'paused', 'non_renewing'] } },
          },
          {
            model: Credential,
            as: 'credentials',
            attributes: ['service'],
          },
        ],
      },
    ],
    where: {
      status: { [Op.eq]: 'subscribed' },
      //agencyClientId: { [Op.eq]: 'e3f1a360-dacf-4a29-85b1-56e381290e36' },
    },
    order: [['client', 'ASC']],
  };

  options.where.$and = where(
    col(`account->subscription.subscriptionId`),
    Op.not,
    null
  );

  return await AgencyClient.findAndCountAll(options);
};

const start = async () => {
  dotenv.config({ path: 'config/config.env' });
  await sequelize.authenticate();
  console.log('Database Connected!');

  const clients = await getClients();
  console.log(`Rows to process: ${clients.count}`);

  clients.rows.forEach(async (client, index) => {
    console.log(index, ': ', client.client, client.agencyClientId);

    let hasSpApi = false;
    let hasAdvApi = false;
    if (client.account.credentials.length > 0) {
      let spApi = client.account.credentials.find((x) => x.service === 'spApi');
      let advApi = client.account.credentials.find(
        (x) => x.service === 'advApi'
      );
      if (spApi) {
        hasSpApi = true;
      }
      if (advApi) {
        hasAdvApi = true;
      }
    }

    if (!hasAdvApi || !hasSpApi) {
      await sendReauthEmail({
        name: client.client,
        email: client.defaultContact.email,
        spApi: hasSpApi,
        advApi: hasAdvApi,
      });
    } else {
      console.log('skipped', hasAdvApi, hasSpApi);
    }
  });
};

start();
