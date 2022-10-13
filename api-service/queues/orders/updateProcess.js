const {
  Order,
  OrderItem,
  OrderAddress,
  OrderBuyerInfo,
  SyncRecord,
  SpRequest,
  sequelize,
} = require('../../models');

const updateProcess = async (job, done) => {
  const { spRequestId, amazonOrderId } = job.data;

  try {
    // * Get Selling Partner request details
    const spRequest = await SpRequest.findByPk(spRequestId, {
      include: {
        model: SyncRecord,
        as: 'syncRecord',
      },
    });

    await spRequest.update({ message: `Updating records` });

    // * Get account information
    const account = await spRequest.syncRecord.getAccount();
    const { accountId } = account;

    // * Initialize SP-API client
    const spApiClient = await account.spApiClient('na');

    // * Get Order Details
    const orderObject = await spApiClient.callAPI({
      endpoint: 'orders',
      operation: 'getOrder',
      path: {
        orderId: amazonOrderId,
      },
    });
    const order = prepareOrder(accountId, orderObject);

    // * Get Order Items
    const { OrderItems } = await spApiClient.callAPI({
      endpoint: 'orders',
      operation: 'getOrderItems',
      path: {
        orderId: amazonOrderId,
      },
    });
    const orderItems = prepareOrderItems(amazonOrderId, OrderItems);

    const orderAddress = prepareOrderAddress(
      amazonOrderId,
      orderObject.ShippingAddress
    );

    // * Get Order Buyer Info
    // * Will be deprecated on January 12, 2022
    const orderBuyerInfoObject = await spApiClient.callAPI({
      endpoint: 'orders',
      operation: 'getOrderBuyerInfo',
      path: {
        orderId: amazonOrderId,
      },
    });
    const orderBuyerInfo = prepareOrderBuyerInfo(
      amazonOrderId,
      orderBuyerInfoObject
    );

    await sequelize.transaction(async (t1) => {
      try {
        // * Save Order
        await Order.upsert(order);

        // * Save Address - check first if the order return an order address
        if (orderAddress !== false) {
          await OrderAddress.upsert(orderAddress);
        }

        // * Save Order Buyer Info
        await OrderBuyerInfo.upsert(orderBuyerInfo);

        // * Process Order Items and Order Item Buyer Info
        const items = await OrderItem.findAll({
          where: { amazonOrderId },
        });

        // If the items are not yet added
        if (items.length === 0) {
          if (orderItems.length) {
            await OrderItem.bulkCreate(orderItems);
          }
        } else {
          let index = 0;
          items.map(async (item) => {
            if (typeof orderItems[index] === 'undefined') {
              await item.update(orderItems[index]);
            }
            index++;
          });
        }
      } catch (error) {
        done(new Error(error));
      }
    });
    done(null, { ...job.data, count: 1 }); // processing one order at a time
  } catch (error) {
    done(new Error(error));
  }
};

const prepareOrder = (accountId, order) => {
  const {
    AmazonOrderId: amazonOrderId,
    MarketplaceId: marketplaceId,
    PurchaseDate: purchaseDate,
    LastUpdateDate: lastUpdateDate,
    OrderStatus: orderStatus,
    SellerOrderId: sellerOrderId,
    FulfillmentChannel: fulfillmentChannel,
    SalesChannel: salesChannel,
    ShipServiceLevel: shipServiceLevel,
    IsBusinessOrder: isBusinessOrder,
    NumberOfItemsShipped: numberOfItemsShipped,
    OrderType: orderType,
    EarliestShipDate: earlistShipDate,
    LatestShipDate: latestShipDate,
    OrderTotal,
    ShipPromotionDiscount: shipPromotionDiscount,
    NumberOfItemsUnshipped: numberOfItemsUnshipped,
    PaymentMethod: paymentMethod,
    PaymentMethodDetails: paymentMethodDetails,
    ShipmentServiceLevelCategory: shipmentServiceLevelCategory,
    SellerDisplayName: sellerDisplayName,
    OrderChannel: orderChannel,
    PaymentExecutionDetail: paymentExecutionDetail,
    EasyShipShipmentStatus: easyShipShipmentStatus,
    CbaDisplayableShippingLabel: cbaDisplayableShippingLabel,
    EarliestDeliveryDate: earliestDeliveryDate,
    LatestDeliveryDate: latestDeliveryDate,
    ReplacedOrderId: replacedOrderId,
    PromiseResponseDueDate: promiseResponseDueDate,
    DefaultShipFromLocationAddress: defaultShipFromLocationAddress,
    FulfillmentInstruction: fulfillmentInstruction,
    MarketplaceTaxInfo: marketplaceTaxInfo,
    IsPremiumOrder: isPremiumOrder,
    IsPrime: isPrime,
    IsReplacementOrder: isReplacementOrder,
    IsSoldByAB: isSoldByAB,
    IsISPU: isISPU,
    IsGlobalExpressEnabled: isGlobalExpressEnabled,
    IsEstimatedShipDateSet: isEstimatedShipDateSet,
  } = order;

  let orderTotalCurrencyCode = '';
  let orderTotalAmount = 0;
  if (OrderTotal !== undefined) {
    const { CurrencyCode, Amount } = OrderTotal;
    orderTotalCurrencyCode = CurrencyCode;
    orderTotalAmount = Amount;
  }

  return {
    amazonOrderId,
    accountId,
    marketplaceId,
    purchaseDate,
    lastUpdateDate,
    orderStatus,
    sellerOrderId,
    fulfillmentChannel,
    salesChannel,
    shipServiceLevel,
    isBusinessOrder,
    numberOfItemsShipped,
    orderType,
    earlistShipDate,
    latestShipDate,
    orderTotalCurrencyCode,
    orderTotalAmount,
    shipPromotionDiscount,
    numberOfItemsUnshipped,
    paymentMethod,
    paymentMethodDetails,
    shipmentServiceLevelCategory,
    sellerDisplayName,
    orderChannel,
    paymentExecutionDetail,
    easyShipShipmentStatus,
    cbaDisplayableShippingLabel,
    earliestDeliveryDate,
    latestDeliveryDate,
    replacedOrderId,
    promiseResponseDueDate,
    defaultShipFromLocationAddress,
    fulfillmentInstruction,
    marketplaceTaxInfo,
    isPremiumOrder,
    isPrime,
    isReplacementOrder,
    isSoldByAB,
    isISPU,
    isGlobalExpressEnabled,
    isEstimatedShipDateSet,
  };
};

const prepareOrderItems = (amazonOrderId, orderItems) => {
  return orderItems.map((orderItem) => {
    const {
      OrderItemId: amazonOrderItemId,
      ASIN: asin,
      Title: title,
      SellerSKU: sellerSku,
      QuantityOrdered: quantityOrdered,
      QuantityShipped: quantityShipped,
      ProductInfo,
      ItemPrice,
      ItemTax,
      TaxCollection,
      PromotionDiscountTax,
      PromotionDiscount,
      SerialNumberRequired: serialNumberRequired,
      IsGift: isGift,
      IsTransparency: isTransparency,
      PointsGranted: pointsGranted,
      ShippingPrice,
      ShippingTax,
      ShippingDiscount,
      ShippingDiscountTax,
      PromotionIds: promotionIds,
      CODFee,
      CODFeeDiscount,
      ConditionNote: conditionNote,
      ConditionId: conditionId,
      ConditionSubtypeId: conditionSubtypeId,
      ScheduledDeliveryStartDate: scheduledDeliveryStartDate,
      ScheduledDeliveryEndDate: sheduledDeliveryEndDate,
      PriceDesignation: priceDesignation,
      IossNumber: iossNumber,
      StoreChainStoreId: storeChainStoreId,
      DeemedResellerCategory: deemedResellerCategory,
    } = orderItem;

    const { NumberOfItems: numberOfItems } = ProductInfo;

    let itemPriceCurrencyCode = '';
    let itemPriceAmount = 0;
    if (ItemPrice !== undefined) {
      const { CurrencyCode, Amount } = ItemPrice;
      itemPriceCurrencyCode = CurrencyCode;
      itemPriceAmount = Amount;
    }

    let itemTaxCurrencyCode = '';
    let itemTaxAmount = 0;
    if (ItemTax !== undefined) {
      const { CurrencyCode, Amount } = ItemTax;
      itemTaxCurrencyCode = CurrencyCode;
      itemTaxAmount = Amount;
    }

    let taxCollectionCollectionModel = '';
    let taxCollectionReponsibleParty = '';
    if (TaxCollection !== undefined) {
      const { Model, ReponsibleParty } = TaxCollection;
      taxCollectionCollectionModel = Model;
      taxCollectionReponsibleParty = ReponsibleParty;
    }

    let promotionDiscountTaxCurrencyCode = '';
    let promotionDiscountTaxAmount = 0;
    if (PromotionDiscountTax !== undefined) {
      const { CurrencyCode, Amount } = PromotionDiscountTax;
      promotionDiscountTaxCurrencyCode = CurrencyCode;
      promotionDiscountTaxAmount = Amount;
    }

    let promotionDiscountCurrencyCode = '';
    let promotionDiscountAmount = 0;
    if (PromotionDiscount !== undefined) {
      const { CurrencyCode, Amount } = PromotionDiscount;
      promotionDiscountCurrencyCode = CurrencyCode;
      promotionDiscountAmount = Amount;
    }

    let shippingPriceCurrencyCode = '';
    let shippingPriceAmount = 0;
    if (ShippingPrice !== undefined) {
      const { CurrencyCode, Amount } = ShippingPrice;
      shippingPriceCurrencyCode = CurrencyCode;
      shippingPriceAmount = Amount;
    }

    let shippingTaxCurrencyCode = '';
    let shippingTaxAmount = 0;
    if (ShippingTax !== undefined) {
      const { CurrencyCode, Amount } = ShippingTax;
      shippingTaxCurrencyCode = CurrencyCode;
      shippingTaxAmount = Amount;
    }

    let shippingDiscountCurrencyCode = '';
    let shippingDiscountAmount = 0;
    if (ShippingDiscount !== undefined) {
      const { CurrencyCode, Amount } = ShippingDiscount;
      shippingDiscountCurrencyCode = CurrencyCode;
      shippingDiscountAmount = Amount;
    }

    let shippingDiscountTaxCurrencyCode = '';
    let shippingDiscountTaxAmount = 0;
    if (ShippingDiscountTax !== undefined) {
      const { CurrencyCode, Amount } = ShippingDiscountTax;
      shippingDiscountTaxCurrencyCode = CurrencyCode;
      shippingDiscountTaxAmount = Amount;
    }

    let codFeeCurrencyCode = '';
    let codFeeAmount = 0;
    if (CODFee !== undefined) {
      const { CurrencyCode, Amount } = CODFee;
      codFeeCurrencyCode = CurrencyCode;
      codFeeAmount = Amount;
    }

    let codFeeDiscountCurrencyCode = '';
    let codFeeDiscountAmount = 0;
    if (CODFeeDiscount !== undefined) {
      const { CurrencyCode, Amount } = CODFeeDiscount;
      codFeeDiscountCurrencyCode = CurrencyCode;
      codFeeDiscountAmount = Amount;
    }

    return {
      amazonOrderItemId,
      amazonOrderId,
      asin,
      title,
      sellerSku,
      quantityOrdered,
      quantityShipped,
      numberOfItems,
      itemPriceCurrencyCode,
      itemPriceAmount,
      itemTaxCurrencyCode,
      itemTaxAmount,
      taxCollectionCollectionModel,
      taxCollectionReponsibleParty,
      promotionDiscountTaxCurrencyCode,
      promotionDiscountTaxAmount,
      promotionDiscountCurrencyCode,
      promotionDiscountAmount,
      serialNumberRequired,
      isGift,
      isTransparency,
      pointsGranted,
      shippingPriceCurrencyCode,
      shippingPriceAmount,
      shippingTaxCurrencyCode,
      shippingTaxAmount,
      shippingDiscountCurrencyCode,
      shippingDiscountAmount,
      shippingDiscountTaxCurrencyCode,
      shippingDiscountTaxAmount,
      promotionIds,
      codFeeCurrencyCode,
      codFeeAmount,
      codFeeDiscountCurrencyCode,
      codFeeDiscountAmount,
      conditionNote,
      conditionId,
      conditionSubtypeId,
      scheduledDeliveryStartDate,
      sheduledDeliveryEndDate,
      priceDesignation,
      iossNumber,
      storeChainStoreId,
      deemedResellerCategory,
    };
  });
};

const prepareOrderAddress = (amazonOrderId, orderAddress) => {
  if (orderAddress !== undefined) {
    const {
      AddressLine1: addressLine1,
      AddressLine2: addressLine2,
      AddressLine3: addressLine3,
      County: county,
      District: district,
      Municipality: municipality,
      Phone: phone,
      AddressType: addressType,
      StateOrRegion: stateOrRegion,
      PostalCode: postalCode,
      City: city,
      CountryCode: countryCode,
      Name: name,
    } = orderAddress;

    return {
      amazonOrderId,
      stateOrRegion,
      postalCode,
      city,
      countryCode,
      name,
      addressLine1,
      addressLine2,
      addressLine3,
      county,
      district,
      municipality,
      phone,
      addressType,
    };
  } else {
    return false;
  }
};

const prepareOrderBuyerInfo = (amazonOrderId, orderBuyerInfo) => {
  const {
    BuyerEmail: buyerEmail,
    BuyerName: buyerName,
    BuyerCounty: buyerCounty,
    BuyerTaxInfo: buyerTaxInfo,
    PurchaseOrderNumber: purchaseOrderNumber,
  } = orderBuyerInfo;

  return {
    amazonOrderId,
    buyerEmail,
    buyerName,
    buyerCounty,
    buyerTaxInfo,
    purchaseOrderNumber,
  };
};

module.exports = updateProcess;
