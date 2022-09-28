const {
  Order,
  OrderItem,
  OrderAddress,
  OrderBuyerInfo,
  SpReport,
  SyncRecord,
  Marketplace,
  sequelize,
} = require('../../models');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

module.exports = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { spReportId } = job.data;

    try {
      const spReport = await SpReport.findByPk(spReportId, {
        include: {
          model: SyncRecord,
          as: 'syncRecord',
        },
      });

      const account = await spReport.syncRecord.getAccount();
      const spApiClient = await account.spApiClient('na');

      const response = await spApiClient.callAPI({
        operation: 'getReport',
        path: { reportId: spReport.reportId },
      });

      const { reportDocumentId } = response;

      if (!reportDocumentId) {
        return reject(
          new Error(
            `Report Document is not yet ready, retrying in 5 minutes. Current Status: ${response.processingStatus}`
          )
        );
      }

      const reportDocumentResponse = await spApiClient.callAPI({
        operation: 'getReportDocument',
        path: { reportDocumentId },
      });

      const List = await spApiClient.download(reportDocumentResponse, {
        json: true,
      });

      const filteredOrders = List.reduce((acc, current) => {
        const x = acc.find(
          (item) => item['amazon-order-id'] === current['amazon-order-id']
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      const marketplaces = await Marketplace.findAll({
        attributes: ['marketplaceId', 'name'],
      });

      const orders = formattedOrders(
        account.accountId,
        marketplaces,
        filteredOrders
      );
      const orderItems = formattedOrderItems(List);
      const orderAddresses = formattedOrderAddresses(filteredOrders);
      const orderBuyerInfos = formattedOrderBuyerInfo(filteredOrders);

      await spReport.update({
        message: `Saving ${orders.length} records`,
      });

      //If has orders.
      if (orders.length) {
        await sequelize.transaction(async (t1) => {
          try {
            await Order.bulkCreate(orders, {
              updateOnDuplicate: ['lastUpdateDate', 'orderStatus'],
            });
            if (orderItems.length) {
              await OrderItem.bulkCreate(orderItems);
            }
            if (orderAddresses.length) {
              await OrderAddress.bulkCreate(orderAddresses, {
                updateOnDuplicate: [
                  'city',
                  'stateOrRegion',
                  'postalCode',
                  'countryCode',
                ],
              });
            }
            if (orderBuyerInfos.length) {
              await OrderBuyerInfo.bulkCreate(orderBuyerInfos, {
                updateOnDuplicate: ['purchaseOrderNumber'],
              });
            }
          } catch (error) {
            return reject(new Error(error.message));
          }
        });
      }
      return resolve({ spReportId, count: orders.length });
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * format orders.
 *
 * @param string accountId
 * @param array orders
 * @returns array
 */
const formattedOrders = (accountId, marketplaces, orders) => {
  return orders.map((o) => {
    const {
      'amazon-order-id': amazonOrderId,
      'purchase-date': purchaseDate,
      'last-updated-date': lastUpdateDate,
      'order-status': orderStatus,
      'merchant-order-id': sellerOrderId,
      'fulfillment-channel': fulfillmentChannel,
      'sales-channel': salesChannel,
      'ship-service-level': shipServiceLevel,
      'ship-promotion-discount': shipPromotionDiscount,
      'is-business-order': isBusinessOrder,
    } = o;

    const marketplace = marketplaces.find((m) => m.name == salesChannel);

    return {
      amazonOrderId,
      accountId,
      marketplaceId: marketplace ? marketplace.marketplaceId : null,
      purchaseDate,
      lastUpdateDate,
      orderStatus,
      sellerOrderId,
      fulfillmentChannel: fulfillmentChannel == 'Amazon' ? 'AFN' : 'MFN',
      salesChannel,
      shipServiceLevel,
      shipPromotionDiscount:
        shipPromotionDiscount == '' ? null : shipPromotionDiscount,
      isBusinessOrder,
    };
  });
};

/**
 * format order items.
 *
 * @param array raw orders
 * @returns array
 */
const formattedOrderItems = (items) => {
  return items.map((item) => {
    const {
      'amazon-order-id': amazonOrderId,
      'product-name': title,
      sku: sellerSku,
      asin,
      'item-status': itemStatus,
      quantity: quantityOrdered,
      currency: itemPriceCurrencyCode,
      'item-price': itemPriceAmount,
      'item-tax': itemTaxAmount,
      'item-promotion-discount': promotionDiscountAmount,
      'shipping-price': shippingPriceAmount,
      'shipping-tax': shippingTaxAmount,
      'promotion-ids': promotionIds,
      'price-designation': priceDesignation,
    } = item;

    return {
      amazonOrderId,
      title,
      sellerSku,
      asin,
      itemStatus: itemStatus == '' ? null : itemStatus,
      quantityOrdered: quantityOrdered == '' ? null : quantityOrdered,
      itemPriceCurrencyCode:
        itemPriceCurrencyCode == '' ? null : itemPriceCurrencyCode,
      itemPriceAmount: itemPriceAmount == '' ? null : itemPriceAmount,
      itemTaxAmount: itemTaxAmount == '' ? null : itemTaxAmount,
      promotionDiscountAmount:
        promotionDiscountAmount == '' ? null : promotionDiscountAmount,
      shippingPriceAmount:
        shippingPriceAmount == '' ? null : shippingPriceAmount,
      shippingTaxAmount: shippingTaxAmount == '' ? null : shippingTaxAmount,
      promotionIds: promotionIds == '' ? null : promotionIds,
      priceDesignation: priceDesignation == '' ? null : priceDesignation,
    };
  });
};

/**
 * format order addresses.
 *
 * @param array orders
 * @returns array
 */
const formattedOrderAddresses = (orders) => {
  return orders.map((order) => {
    const {
      'amazon-order-id': amazonOrderId,
      'ship-city': city,
      'ship-state': stateOrRegion,
      'ship-postal-code': postalCode,
      'ship-country': countryCode,
    } = order;

    return {
      amazonOrderId,
      city: city == '' ? null : city,
      stateOrRegion: stateOrRegion == '' ? null : stateOrRegion,
      postalCode: postalCode == '' ? null : postalCode,
      countryCode: countryCode == '' ? null : countryCode,
    };
  });
};

/**
 * format order buyer info.
 *
 * @param array order
 * @returns array
 */
const formattedOrderBuyerInfo = (orders) => {
  return orders.map((order) => {
    const {
      'amazon-order-id': amazonOrderId,
      'purchase-order-number': purchaseOrderNumber,
    } = order;

    return {
      amazonOrderId,
      purchaseOrderNumber:
        purchaseOrderNumber == '' ? null : purchaseOrderNumber,
    };
  });
};
