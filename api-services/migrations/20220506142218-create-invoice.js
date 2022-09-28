'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      invoiceId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      invoiceNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      customerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      invoiceDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      currencySymbol: {
        type: Sequelize.STRING,
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionType: {
        type: Sequelize.STRING,
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoices');
  },
};
