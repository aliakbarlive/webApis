'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('orderItems', 'productName', 'title', {
          transaction: t,
        }),
        queryInterface.renameColumn('orderItems', 'sku', 'sellerSku', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'orderItems',
          'quantity',
          'quantityOrdered',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'orderItems',
          'currency',
          'itemPriceCurrencyCode',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'orderItems',
          'itemPrice',
          'itemPriceAmount',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn('orderItems', 'itemTax', 'itemTaxAmount', {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('orderItems', 'title', 'productName', {
          transaction: t,
        }),
        queryInterface.renameColumn('orderItems', 'sellerSku', 'sku', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'orderItems',
          'quantityOrdered',
          'quantity',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'orderItems',
          'itemPriceCurrencyCode',
          'currency',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn(
          'orderItems',
          'itemPriceAmount',
          'itemPrice',
          {
            transaction: t,
          }
        ),
        queryInterface.renameColumn('orderItems', 'itemTaxAmount', 'itemTax', {
          transaction: t,
        }),
      ]);
    });
  },
};
