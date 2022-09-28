'use strict';
const { Model } = require('sequelize');
const SellingPartnerAPI = require('amazon-sp-api');
const AdvertisingClient = require('amazon-ppc-api');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const { models } = sequelize;

  class Account extends Model {
    static associate({
      Product,
      Credential,
      AdvProfile,
      InitialSyncStatus,
      AgencyClient,
      Subscription,
      Commission,
      AccountMarketplace,
      Tag,
      Member,
      Plan,
      Invite,
      AccountEmployee,
    }) {
      this.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

      this.hasMany(Member, { foreignKey: 'accountId', as: 'members' });
      this.hasMany(AccountEmployee, {
        foreignKey: 'accountId',
        as: 'employees',
      });

      this.hasOne(AgencyClient, {
        foreignKey: 'accountId',
      });
      this.hasOne(Subscription, {
        foreignKey: 'accountId',
        as: 'subscription',
      });
      this.hasMany(Commission, {
        foreignKey: 'accountId',
        as: 'commissions',
      });

      this.hasMany(Credential, { foreignKey: 'accountId', as: 'credentials' });

      this.hasMany(Product, { foreignKey: 'accountId', as: 'products' });

      this.hasOne(InitialSyncStatus, {
        foreignKey: 'accountId',
        as: 'initialSyncStatus',
      });

      this.hasMany(AccountMarketplace, {
        foreignKey: 'accountId',
        as: 'marketplaces',
      });

      this.hasMany(AdvProfile, { foreignKey: 'accountId', as: 'advProfiles' });

      this.hasMany(Tag, { foreignKey: 'accountId', constraints: false });

      this.hasMany(Invite, {
        foreignKey: 'accountId',
        as: 'invites',
      });
    }
  }

  Account.init(
    {
      accountId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sellingPartnerId: {
        type: DataTypes.STRING,
        unique: true,
      },
      isOnboarding: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      scopes: {
        withCredentialsOverview: {
          attributes: {
            include: [
              [
                sequelize.literal(
                  `(SELECT EXISTS
                    (
                      SELECT * FROM credentials
                        where "credentials"."accountId" = "Account"."accountId"
                        and service = 'spApi'
                    )
                  )`
                ),
                'spApiAuthorized',
              ],
              [
                sequelize.literal(
                  `(SELECT EXISTS
                    (
                      SELECT * FROM credentials
                        where "credentials"."accountId" = "Account"."accountId"
                        and service = 'advApi'
                    )
                  )`
                ),
                'advApiAuthorized',
              ],
            ],
          },
        },
        withInitialSyncStatus: {
          attributes: {
            include: [
              [
                sequelize.literal(
                  `(SELECT EXISTS
                    (
                      SELECT * FROM "initialSyncStatus"
                        where "initialSyncStatus"."accountId" = "Account"."accountId" AND "inventory" = 'COMPLETED' AND "orders" = 'COMPLETED' AND "financialEvents" = 'COMPLETED' AND "products" = 'COMPLETED'
                        AND "reviews" = 'COMPLETED' AND "inboundFBAShipments" = 'COMPLETED' AND "inboundFBAShipmentItems" = 'COMPLETED' AND "advSnapshots" = 'COMPLETED' AND "advPerformanceReport" = 'COMPLETED'
                    )
                  )`
                ),
                'initialSyncCompleted',
              ],
            ],
          },
        },
      },
    }
  );

  Account.afterCreate(async (account, options) => {
    try {
      await account.createInitialSyncStatus();
    } catch (err) {
      console.log('Error on account after create hook.', err.message);
    }
  });

  Account.prototype.sendNotificationToUsers = async function (type, data = {}) {
    const queue = require('../queues/notifications/queue');
    const jobData = { ...data, accountId: this.accountId };

    await queue.add(type, jobData, {
      attempts: 3,
      backoff: 60000,
    });
  };

  Account.prototype.afterSpApiAuthorized = async function () {
    try {
      const plan = await this.getPlan();

      if (plan.name !== 'agency') {
        await this.sendNotificationToUsers('initialSyncStarted');

        await this.sync('orders');
        await this.sync('financialEvents');
        await this.sync('inboundFBAShipments');
        await this.sync('inboundFBAShipmentItems');
        await this.sync('inventory');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  Account.prototype.afterAdvApiAuthorized = async function () {
    try {
      const plan = await this.getPlan();
      if (plan.name !== 'agency') {
        await this.sync('advSnapshots');
        await this.sync('advPerformanceReport');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  Account.prototype.spApiClient = async function (region) {
    try {
      const spApiCredential = await this.credentialFor('spApi');

      const apiClient = new SellingPartnerAPI({
        region,
        refresh_token: spApiCredential.refreshToken,
        access_token: spApiCredential.accessToken,
      });

      if (moment().isAfter(moment(spApiCredential.accessTokenExpire))) {
        await apiClient.refreshAccessToken();

        await spApiCredential.update({
          accessToken: apiClient.access_token,
          refreshToken: apiClient.refresh_token,
          accessTokenExpire: moment()
            .add(1, 'hour')
            .format('MM/DD/YYYY HH:mm:ss'),
        });
      }
      return apiClient;
    } catch (error) {
      console.log(error.message);
    }
  };

  Account.prototype.advApiClient = async function (config) {
    try {
      const advApiCredential = await this.credentialFor('advApi');

      const apiClient = new AdvertisingClient({
        clientId: process.env.ADVERTISING_API_CLIENT_ID,
        clientSecret: process.env.ADVERTISING_API_CLIENT_SECRET,
        refreshToken: advApiCredential.refreshToken,
        accessToken: advApiCredential.accessToken,
        ...config,
      });

      if (moment().isAfter(moment(advApiCredential.accessTokenExpire))) {
        await apiClient.refresh();

        await advApiCredential.update({
          accessToken: apiClient.options.accessToken,
          refreshToken: apiClient.options.refreshToken,
          accessTokenExpire: moment()
            .add(1, 'hour')
            .format('MM/DD/YYYY HH:mm:ss'),
        });
      }

      return apiClient;
    } catch (error) {
      console.log(error);
    }
  };

  Account.prototype.credentialFor = async function (service) {
    try {
      const credentials = await this.getCredentials({
        where: {
          service,
        },
      });

      if (!credentials.length) {
        throw new Error(`Account has no credential for ${service}.`);
      }

      return credentials[0];
    } catch (error) {
      console.log(error);
    }
  };

  Account.prototype.sync = async function (dataType, syncType = 'initial') {
    try {
      const file = syncType == 'initial' ? 'request' : 'cron';
      let options = {};

      // If sync type is not initial and repeatable.
      // Get options from the SyncRecord DATA_TYPES
      if (syncType != 'initial') {
        const { DATA_TYPES } = sequelize.models.SyncRecord;
        const syncDataType = DATA_TYPES.find((dt) => dt.name == dataType);
        options = {
          jobId: `${this.accountId}-${syncType}-${dataType}`,
          repeat: {
            cron: syncDataType.cron.replace('minute', moment().format('mm')),
          },
        };
      }

      const queue = require(`../queues/${dataType}/${file}`);
      const job = await queue.add(
        {
          accountId: this.accountId,
          syncType,
        },
        options
      );

      if (dataType === 'advSnapshots' && syncType !== 'initial') {
        await queue.add(
          {
            accountId: this.accountId,
            advanced: true,
            syncType,
          },
          {
            jobId: `${this.accountId}-${syncType}-${dataType}-advanced`,
            repeat: {
              cron: '0 4 * * *',
            },
          }
        );
      }

      return job;
    } catch (error) {
      console.log(error.message);
    }
  };

  Account.prototype.sendAlertToUsers = async function (details) {
    const users = await models.User.findAll({
      include: {
        model: models.Member,
        as: 'memberships',
        where: { accountId: this.accountId },
        attributes: [],
      },
    });

    await Promise.all(
      users.map(async (user) => {
        await user.sendAlert({
          accountId: this.accountId,
          ...details,
        });
      })
    );
  };
  return Account;
};
