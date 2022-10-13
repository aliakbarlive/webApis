'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientMigration extends Model {}

  ClientMigration.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: DataTypes.STRING,
      error: DataTypes.JSONB,
      accountId: DataTypes.UUID,
      userId: DataTypes.UUID,
      agencyClientId: DataTypes.UUID,
      plan: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      description: DataTypes.STRING,
      commissionCa: DataTypes.DECIMAL,
      commissionTypeCa: DataTypes.STRING,
      commissionRateCa: DataTypes.DECIMAL,
      commissionMonthlyThresholdCa: DataTypes.DECIMAL,
      commissionUs: DataTypes.DECIMAL,
      commissionTypeUs: DataTypes.STRING,
      commissionRateUs: DataTypes.DECIMAL,
      commissionMonthlyThresholdUs: DataTypes.DECIMAL,
      clientName: DataTypes.STRING,
      email: DataTypes.STRING,
      serviceAgreement: DataTypes.STRING,
      address: DataTypes.STRING,
      website: DataTypes.STRING,
      aboutUs: DataTypes.STRING,
      overview: DataTypes.STRING,
      painPoints: DataTypes.STRING,
      goals: DataTypes.STRING,
      productCategories: DataTypes.STRING,
      amazonPage: DataTypes.STRING,
      asin: DataTypes.STRING,
      notes: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: DataTypes.STRING,
      zohoId: DataTypes.STRING,
      baseline: DataTypes.DECIMAL,
      grossUs: DataTypes.DECIMAL,
      grossCa: DataTypes.DECIMAL,
      pmEmail: DataTypes.STRING,
      amEmail: DataTypes.STRING,
      resend: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ClientMigration',
      tableName: 'clientMigrations',
    }
  );

  return ClientMigration;
};
