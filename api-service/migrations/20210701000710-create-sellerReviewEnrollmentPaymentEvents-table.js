'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sellerReviewEnrollmentPaymentEvents', {
      sellerReviewEnrollmentPaymentEventId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
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
      parentAsin: {
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
      enrollmentId: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('sellerReviewEnrollmentPaymentEvents');
  },
};
