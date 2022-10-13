'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoiceItems', {
      invoiceItemId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      invoiceId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'invoices',
            schema: 'public',
          },
          key: 'invoiceId',
        },
      },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      code: Sequelize.STRING,
      tags: Sequelize.JSON,
      customFields: Sequelize.JSON,
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      discountAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      itemTotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      taxId: Sequelize.STRING,
      taxExemptionId: Sequelize.STRING,
      taxExemptionCode: Sequelize.STRING,
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
    await queryInterface.dropTable('invoiceItems');
  },
};
