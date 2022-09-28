'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clientMigrations', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      status: Sequelize.STRING,
      error: Sequelize.JSONB,
      accountId: Sequelize.UUID,
      userId: Sequelize.UUID,
      agencyClientId: Sequelize.UUID,
      plan: Sequelize.STRING,
      price: Sequelize.DECIMAL,
      description: Sequelize.STRING,
      commissionCa: Sequelize.DECIMAL,
      commissionTypeCa: Sequelize.STRING,
      commissionRateCa: Sequelize.DECIMAL,
      commissionMonthlyThresholdCa: Sequelize.DECIMAL,
      commissionUs: Sequelize.DECIMAL,
      commissionTypeUs: Sequelize.STRING,
      commissionRateUs: Sequelize.DECIMAL,
      commissionMonthlyThresholdUs: Sequelize.DECIMAL,
      clientName: Sequelize.STRING,
      email: Sequelize.STRING,
      serviceAgreement: Sequelize.STRING,
      address: Sequelize.STRING,
      website: Sequelize.STRING,
      aboutUs: Sequelize.TEXT,
      overview: Sequelize.TEXT,
      painPoints: Sequelize.TEXT,
      goals: Sequelize.TEXT,
      productCategories: Sequelize.STRING,
      amazonPage: Sequelize.STRING,
      asin: Sequelize.TEXT,
      notes: Sequelize.TEXT,
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      password: Sequelize.STRING,
      zohoId: Sequelize.STRING,
      baseline: Sequelize.DECIMAL,
      grossUs: Sequelize.DECIMAL,
      grossCa: Sequelize.DECIMAL,
      pmEmail: Sequelize.STRING,
      amEmail: Sequelize.STRING,
      resend: Sequelize.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clientMigrations');
  },
};
