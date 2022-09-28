'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'orderBuyerInfos',
          {
            amazonOrderId: {
              type: Sequelize.STRING,
              primaryKey: true,
              references: {
                model: {
                  tableName: 'orders',
                  schema: 'public',
                },
                key: 'amazonOrderId',
              },
            },
            buyerEmail: Sequelize.STRING,
            buyerName: Sequelize.STRING,
            buyerCounty: Sequelize.STRING,
            buyerTaxInfo: Sequelize.JSONB,
            purchaseOrderNumber: Sequelize.STRING,
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orderBuyerInfos');
  },
};
