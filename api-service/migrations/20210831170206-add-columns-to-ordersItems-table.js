'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'orderItems',
          'amazonOrderItemId',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'quantityShipped',
          {
            type: Sequelize.INTEGER,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'numberOfItems',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'itemTaxCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'taxCollectionCollectionModel',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'taxCollectionReponsibleParty',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'promotionDiscountTaxCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'promotionDiscountTaxAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'promotionDiscountCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'promotionDiscountAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'serialNumberRequired',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'isGift',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'isTransparency',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'pointsGranted',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingPriceCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingPriceAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingTaxCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingTaxAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingDiscountCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingDiscountAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingDiscountTaxCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'shippingDiscountTaxAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'promotionIds',
          {
            type: Sequelize.JSONB,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'codFeeCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'codFeeAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'codFeeDiscountCurrencyCode',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'codFeeDiscountAmount',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'conditionNote',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'conditionId',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'conditionSubtypeId',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'scheduledDeliveryStartDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'scheduledDeliveryEndDate',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'priceDesignation',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'iossNumber',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'storeChainStoreId',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderItems',
          'deemedResellerCategory',
          {
            type: Sequelize.JSONB,
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
        queryInterface.removeColumn('orderItems', 'amazonOrderItemId', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'quantityShipped', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'numberOfItems', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'itemTaxCurrencyCode', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'orderItems',
          'taxCollectionCollectionModel',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn(
          'orderItems',
          'taxCollectionReponsibleParty',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn(
          'orderItems',
          'promotionDiscountTaxCurrencyCode',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn(
          'orderItems',
          'promotionDiscountTaxAmount',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn(
          'orderItems',
          'promotionDiscountCurrencyCode',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('orderItems', 'promotionDiscountAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'serialNumberRequired', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'isGift', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'isTransparency', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'pointsGranted', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'shippingPriceCurrencyCode', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'shippingPriceAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'shippingTaxCurrencyCode', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'shippingTaxAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'orderItems',
          'shippingDiscountCurrencyCode',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('orderItems', 'shippingDiscountAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'orderItems',
          'shippingDiscountTaxCurrencyCode',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('orderItems', 'shippingDiscountTaxAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'promotionIds', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'codFeeCurrencyCode', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'codFeeAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'orderItems',
          'codFeeDiscountCurrencyCode',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('orderItems', 'codFeeDiscountAmount', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'conditionNote', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'conditionId', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'conditionSubtypeId', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'orderItems',
          'scheduledDeliveryStartDate',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('orderItems', 'scheduledDeliveryEndDate', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'priceDesignation', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'iossNumber', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'storeChainStoreId', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderItems', 'deemedResellerCategory', {
          transaction: t,
        }),
      ]);
    });
  },
};
