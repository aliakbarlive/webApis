'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'orders',
          'numberOfItemsShipped',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'orderType',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'earliestShipDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'latestShipDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'orderTotalCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'orderTotalAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'numberOfItemsUnshipped',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'paymentMethod',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'paymentMethodDetails',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'shipmentServiceLevelCategory',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'sellerDisplayName',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'orderChannel',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'paymentExecutionDetail',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'easyShipShipmentStatus',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'cbaDisplayableShippingLabel',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'earliestDeliveryDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'latestDeliveryDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'replacedOrderId',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'promiseResponseDueDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'defaultShipFromLocationAddress',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'fulfillmentInstruction',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'marketplaceTaxInfo',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isPremiumOrder',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isPrime',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isReplacementOrder',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isSoldByAB',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isISPU',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isGlobalExpressEnabled',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orders',
          'isEstimatedShipDateSet',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('orders', 'numberOfItemsShipped', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'orderType', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'earliestShipDate', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'latestShipDate', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'orderTotalCurrencyCode', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'orderTotalAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'numberOfItemsUnshipped', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'paymentMethod', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'paymentMethodDetails', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'shipmentServiceLevelCategory', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'sellerDisplayName', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'orderChannel', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'paymentExecutionDetail', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'easyShipShipmentStatus', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'cbaDisplayableShippingLabel', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'earliestDeliveryDate', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'latestDeliveryDate', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'replacedOrderId', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'promiseResponseDueDate', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'orders',
          'defaultShipFromLocationAddress',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('orders', 'fulfillmentInstruction', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'marketplaceTaxInfo', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isPremiumOrder', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isPrime', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isReplacementOrder', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isSoldByAB', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isISPU', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isGlobalExpressEnabled', {
          transaction: t,
        }),
        queryInterface.removeColumn('orders', 'isEstimatedShipDateSet', {
          transaction: t,
        }),
      ]);
    });
  },
};
