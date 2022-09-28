'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('couponPaymentEvents', {
      couponPaymentId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      couponId: {
        type: Sequelize.STRING,
      },
      postedDate: {
        type: Sequelize.DATE,
      },
      totalCurrencyCode: {
        type: Sequelize.STRING,
      },
      totalCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      feeType: {
        type: Sequelize.STRING,
      },
      feeCurrencyCode: {
        type: Sequelize.STRING,
      },
      feeCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      paymentEventId: {
        type: Sequelize.STRING,
      },
      chargeType: {
        type: Sequelize.STRING,
      },
      chargeCurrencyCode: {
        type: Sequelize.STRING,
      },
      chargeCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      clipOrRedemptionCount: {
        type: Sequelize.INTEGER,
      },
      sellerCouponDescription: {
        type: Sequelize.STRING,
      },
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
    await queryInterface.dropTable('couponPaymentEvents');
  },
};
