'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgencyClient extends Model {
    static associate({
      User,
      Account,
      ClientMigration,
      ClientChecklist,
      SubscriptionCycleDate,
      Termination,
      Cell,
      Invoice,
      AgencyClientLog,
    }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
        as: 'account',
      });
      this.belongsTo(User, {
        as: 'defaultContact',
        sourceKey: 'userId',
        foreignKey: 'defaultContactId',
      });
      this.hasOne(ClientMigration, { foreignKey: 'agencyClientId' });
      this.hasMany(ClientChecklist, { foreignKey: 'agencyClientId' });
      this.hasMany(SubscriptionCycleDate, { foreignKey: 'agencyClientId' });
      this.hasMany(AgencyClientLog, { foreignKey: 'agencyClientId' });
      this.hasOne(Termination, {
        foreignKey: 'agencyClientId',
        as: 'termination',
      });
      this.belongsToMany(Cell, {
        through: 'CellClient',
        as: 'cells',
        foreignKey: 'agencyClientId',
      });
      this.hasMany(Invoice, {
        sourceKey: 'zohoId',
        foreignKey: 'customerId',
        as: 'invoices',
      });
    }
  }
  AgencyClient.init(
    {
      agencyClientId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
      },
      siEmail: DataTypes.STRING,
      address: DataTypes.TEXT,
      status: DataTypes.STRING,
      client: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Please enter client name' },
          notEmpty: { msg: 'Client field must not be empty' },
        },
      },
      website: DataTypes.STRING,
      aboutUs: DataTypes.TEXT,
      overview: DataTypes.TEXT,
      painPoints: DataTypes.TEXT,
      goals: DataTypes.TEXT,
      productCategories: DataTypes.TEXT,
      amazonPageUrl: DataTypes.TEXT,
      asinsToOptimize: DataTypes.TEXT,
      otherNotes: DataTypes.TEXT,
      defaultContactId: {
        type: DataTypes.UUID,
        foreignKey: true,
      },
      cellId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      categoryList: DataTypes.JSONB,
      asinList: DataTypes.JSONB,
      hostedpageDetails: DataTypes.JSONB,
      serviceAgreementLink: DataTypes.TEXT,
      draftCommission: DataTypes.JSONB,
      zohoId: DataTypes.STRING,
      invoiceEmails: DataTypes.JSONB,
      phone: DataTypes.STRING,
      contractSigned: DataTypes.DATE,
      contactName: DataTypes.STRING,
      contactName2: DataTypes.STRING,
      primaryEmail: DataTypes.STRING,
      secondaryEmail: DataTypes.STRING,
      thirdEmail: DataTypes.STRING,
      service: DataTypes.STRING,
      accountStatus: DataTypes.STRING,
      draftMarketplace: DataTypes.STRING,
      noCommission: DataTypes.BOOLEAN,
      noCommissionReason: DataTypes.TEXT,
      cancelledAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'AgencyClient',
      tableName: 'agencyClients',
    }
  );
  return AgencyClient;
};
