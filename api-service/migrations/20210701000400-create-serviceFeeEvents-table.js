'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('serviceFeeEvents', {
      serviceFeeEventId: {
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
      amazonOrderId: {
        type: Sequelize.STRING,
      },
      sellerSku: {
        type: Sequelize.STRING,
      },
      fnSku: {
        type: Sequelize.STRING,
      },
      feeDescription: {
        type: Sequelize.TEXT,
      },
      asin: { type: Sequelize.STRING },
      feeReason: { type: Sequelize.STRING },
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
    await queryInterface.dropTable('serviceFeeEvents');
  },
};
