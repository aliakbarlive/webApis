'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('orders', 'shippingPrice', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'shippingTax', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'giftWrapPrice', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'giftWrapTax', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'itemPromotionDiscount', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'promotionIds', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'purchaseOrderNumber', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'priceDesignation', {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'orders',
          'shippingPrice',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'shippingTax',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'giftWrapPrice',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'giftWrapTax',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'itemPromotionDiscount',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'promotionIds',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'purchaseOrderNumber',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'priceDesignation',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
