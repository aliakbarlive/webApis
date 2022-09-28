const path = require('path');
const {
  ItemCharge,
  ItemFee,
  ItemPromotion,
  ItemWithheldTax,
  ItemChargeAdjustment,
  ItemFeeAdjustment,
  ItemPromotionAdjustment,
  ItemTaxWithheldAdjustment,
  ShipmentItem,
  ShipmentAdjustmentItem,
  ShipmentEvent,
  RefundEvent,
  Order,
  OrderItem,
  AdvCampaignRecord,
  AdvCampaign,
  AdvProfile,
  InventoryItem,
  ProductCost,
  Listing,
  Product,
  sequelize,
} = require(path.resolve('.', 'models'));
const { Op, fn, col, literal, cast, QueryTypes } = require('sequelize');
const moment = require('moment');
const _ = require('lodash');

// Common include for the item tables
const includes = (req) => {
  const { accountId } = req.account;
  const { startDate, endDate, marketplaceId } = req.query;

  return {
    model: ShipmentItem,
    attributes: [],
    required: true,
    include: {
      model: ShipmentEvent,
      attributes: [],
      required: true,
      include: {
        model: Order,
        attributes: [],
        required: true,
        where: {
          purchaseDate: {
            [Op.gte]: moment(startDate).startOf('day'),
            [Op.lte]: moment(endDate).endOf('day'),
          },
          accountId,
          marketplaceId,
        },
      },
    },
  };
};

// Common Include for the item adjustment tables
const includeAdjustments = (req) => {
  const { accountId } = req.account;
  const { startDate, endDate, marketplaceId } = req.query;

  return {
    model: ShipmentAdjustmentItem,
    attributes: [],
    required: true,
    include: {
      model: RefundEvent,
      attributes: [],
      required: true,
      include: {
        model: Order,
        attributes: [],
        required: true,
        where: {
          purchaseDate: {
            [Op.gte]: moment(startDate).startOf('day'),
            [Op.lte]: moment(endDate).endOf('day'),
          },
          accountId,
          marketplaceId,
        },
      },
    },
  };
};

const includesByDate = (req) => {
  const { view } = req.query;
  return {
    attributes: [
      [fn('date_trunc', view, col('purchaseDate')), 'type'],
      [fn('sum', col('currencyAmount')), 'amount'],
    ],
    include: includes(req),
    group: [fn('date_trunc', view, col('purchaseDate'))],
    order: [fn('date_trunc', view, col('purchaseDate'))],
    raw: true,
  };
};

const includeAdjustmentsByDate = (req) => {
  const { view } = req.query;
  return {
    attributes: [
      [fn('date_trunc', view, col('purchaseDate')), 'type'],
      [fn('sum', col('currencyAmount')), 'amount'],
    ],
    include: includeAdjustments(req),
    group: [fn('date_trunc', view, col('purchaseDate'))],
    order: [fn('date_trunc', view, col('purchaseDate'))],
    raw: true,
  };
};

// Total Sum
exports.totalSum = (item, index = 'amount') => {
  return parseFloat(
    _.sumBy(item, function (o) {
      return parseFloat(o[index]);
    }).toFixed(2)
  );
};

// Total the items
exports.sumItems = (items, adjustmentItems) => {
  const combinedItems = [...items, ...adjustmentItems];

  const sum = [];

  combinedItems.forEach((item) => {
    // Check if type exists in array
    if (sum.some((element) => element.type === item.type)) {
      // Find index of item that has a specific type
      const index = sum.findIndex((element) => element.type === item.type);

      sum[index] = {
        type: item.type,
        amount: parseFloat(
          (parseFloat(sum[index].amount) + parseFloat(item.amount)).toFixed(2)
        ),
      };
    } else {
      sum.push({ ...item, amount: parseFloat(item.amount) });
    }
  });

  return sum;
};

// Divide the items
exports.divideItems = (items, adjustmentItems, negate, decimal) => {
  const combinedItems = [...items, ...adjustmentItems];

  const divide = [];

  combinedItems.forEach((item) => {
    // Check if type exists in array
    if (divide.some((element) => element.type === item.type)) {
      // Find index of item that has a specific type
      const index = divide.findIndex((element) => element.type === item.type);

      divide[index] = {
        type: item.type,
        amount: parseFloat(
          (parseFloat(divide[index].amount) / parseFloat(item.amount)).toFixed(
            2
          )
        ),
      };
    } else {
      divide.push(item);
    }
  });

  return divide;
};

// Format the date to make it compatible with sumItems method
exports.formatDate = (items) => {
  return items.map((i) => {
    return { type: moment(i.type).format('YYYY-MM-DD'), amount: i.amount };
  });
};

// Prepare the date to display a verbose response
exports.prepareDate = (items, view) => {
  return items.map((i) => {
    let date = moment(i.type).format('MMM D');
    if (view !== 'day') {
      date =
        moment(i.type).startOf(view).format('MMM D') +
        ' - ' +
        moment(i.type).endOf(view).format('MMM D');
    }
    return { date, amount: parseFloat(i.amount) };
  });
};

// Get the Item Charge Breakdown from a marketplace of an account
exports.getItemChargeBreakdown = async (req) => {
  return await ItemCharge.findAll({
    attributes: [
      ['chargeType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includes(req),
    group: ['chargeType'],
    raw: true,
  });
};

// Get the Item Fee Breakdown from a marketplace of an account
exports.getItemFeeBreakdown = async (req) => {
  return await ItemFee.findAll({
    attributes: [
      ['feeType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includes(req),
    group: ['feeType'],
    raw: true,
  });
};

// Get the Item Promotion Breakdown from a marketplace of an account
exports.getItemPromotionBreakdown = async (req) => {
  return await ItemPromotion.findAll({
    attributes: [
      ['promotionType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includes(req),
    group: ['promotionType'],
    raw: true,
  });
};

// Get the Item Withheld Tax Breakdown from a marketplace of an account
exports.getItemWithheldTaxBreakdown = async (req) => {
  return await ItemWithheldTax.findAll({
    attributes: [
      ['chargeType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includes(req),
    group: ['chargeType'],
    raw: true,
  });
};

// Get the Item Charge Adjustment Adjustments Breakdown from a marketplace of an account
exports.getItemChargeAdjustmentBreakdown = async (req) => {
  return await ItemChargeAdjustment.findAll({
    attributes: [
      ['chargeType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includeAdjustments(req),
    group: ['chargeType'],
    raw: true,
  });
};

// Get the Item Fee Adjustment Adjustments Breakdown from a marketplace of an account
exports.getItemFeeAdjustmentBreakdown = async (req) => {
  return await ItemFeeAdjustment.findAll({
    attributes: [
      ['chargeType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includeAdjustments(req),
    group: ['chargeType'],
    raw: true,
  });
};

// Get the Item Tax Withheld Adjustments Breakdown from a marketplace of an account
exports.getItemTaxWithheldAdjustmentBreakdown = async (req) => {
  return await ItemTaxWithheldAdjustment.findAll({
    attributes: [
      ['chargeType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includeAdjustments(req),
    group: ['chargeType'],
    raw: true,
  });
};

// Get the Item Promotion Adjustments Breakdown from a marketplace of an account
exports.getItemPromotionAdjustmentBreakdown = async (req) => {
  return await ItemPromotionAdjustment.findAll({
    attributes: [
      ['promotionType', 'type'],
      [cast(fn('sum', col('currencyAmount')), 'float'), 'amount'],
    ],
    include: includeAdjustments(req),
    group: ['promotionType'],
    raw: true,
  });
};

// Get PPC Sales per account
// campaignType = sponsoredProducts OR sponsoredDisplay
// return column attributedSales30d

// campaignType = sponsoredBrands
// return column attributedSales14d
// --------
// Get PPC Spend per account
// return column cost
exports.getPPCAmount = async (req, column, where) => {
  const { accountId } = req.account;
  const { startDate, endDate, marketplaceId } = req.query;

  const [ppc] = await AdvCampaignRecord.findAll({
    attributes: [[cast(fn('sum', col(column)), 'float'), 'sum']],
    include: {
      model: AdvCampaign,
      attributes: [],
      required: true,
      where,
      include: {
        model: AdvProfile,
        attributes: [],
        required: true,
        where: {
          accountId,
          marketplaceId,
        },
      },
    },
    where: {
      date: {
        [Op.gte]: moment(startDate).startOf('day'),
        [Op.lte]: moment(endDate).endOf('day'),
      },
    },
    raw: true,
  });

  return ppc.sum;
};

// Get total number of orders and units
exports.getOrdersBreakdown = async (req, where) => {
  const { accountId } = req.account;
  const { startDate, endDate, marketplaceId } = req.query;

  const [orders] = await Order.findAll({
    attributes: [
      [cast(fn('COUNT', col('Order.amazonOrderId')), 'float'), 'totalOrders'],
      [cast(fn('SUM', col('quantityOrdered')), 'float'), 'totalUnits'],
    ],
    include: {
      attributes: [],
      model: OrderItem,
      required: true,
    },
    where: {
      accountId,
      marketplaceId,
      orderStatus: {
        [Op.ne]: 'Cancelled',
      },
      purchaseDate: {
        [Op.gte]: moment(startDate).startOf('day'),
        [Op.lte]: moment(endDate).endOf('day'),
      },
      ...where,
    },
    raw: true,
  });

  return orders;
};

// Get COGs Breakdown from the marketplace of an account
exports.getCOGsBreakdown = async (req) => {
  const { accountId } = req.account;
  const { startDate, endDate, marketplaceId } = req.query;

  return await ProductCost.findAll({
    attributes: [
      'InventoryItem.shipmentItems.ShipmentEvent.Order.amazonOrderId',
      [literal('-1 * (SUM ("quantityShipped" * ("cogsAmount")))'), 'unitCosts'],
      [
        literal('-1 * (SUM ("quantityShipped" * ("shippingAmount")))'),
        'shippingCosts',
      ],
      [literal('-1 * (SUM ("quantityShipped" * ("miscAmount")))'), 'miscCosts'],
      [
        literal(
          '-1 * (SUM ("quantityShipped" * ("cogsAmount" + "shippingAmount" + "miscAmount")))'
        ),
        'amount',
      ],
    ],
    include: {
      attributes: [],
      model: InventoryItem,
      required: true,
      include: {
        attributes: [],
        model: ShipmentItem,
        as: 'shipmentItems',
        required: true,
        include: {
          attributes: [],
          model: ShipmentEvent,
          required: true,
          include: {
            attributes: [],
            model: Order,
            required: true,
            where: {
              accountId,
              marketplaceId,
              purchaseDate: {
                [Op.and]: [
                  {
                    [Op.gte]: moment(startDate).startOf('day'),
                    [Op.lte]: moment(endDate).endOf('day'),
                  },
                  {
                    [Op.gte]: col('ProductCost.startDate'),
                    [Op.lte]: col('ProductCost.endDate'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    group: ['InventoryItem->shipmentItems->ShipmentEvent->Order.amazonOrderId'],
    raw: true,
  });
};

// ITEMS BY DATE

// Get the Item Charges By Date from a marketplace of an account
exports.getItemChargeByDate = async (req) => {
  return await ItemCharge.findAll(includesByDate(req));
};

// Get the Item Promotions By Date from a marketplace of an account
exports.getItemPromotionByDate = async (req) => {
  return await ItemPromotion.findAll(includesByDate(req));
};

// Get the Item Withheld Tax By Date from a marketplace of an account
exports.getItemWithheldTaxByDate = async (req) => {
  return await ItemWithheldTax.findAll(includesByDate(req));
};
// Get the Item Fee By Date from a marketplace of an account
exports.getItemFeeByDate = async (req) => {
  return await ItemFee.findAll(includesByDate(req));
};

// Get the Item Charge Adjustment By Date from a marketplace of an account
exports.getItemChargeAdjustmentByDate = async (req) => {
  return await ItemChargeAdjustment.findAll(includeAdjustmentsByDate(req));
};

// Get the Item Tax Withheld Adjustment By Date from a marketplace of an account
exports.getItemTaxWithheldAdjustmentByDate = async (req) => {
  return await ItemTaxWithheldAdjustment.findAll(includeAdjustmentsByDate(req));
};

// Get the Item Promotion Adjustment By Date from a marketplace of an account
exports.getItemPromotionAdjustmentByDate = async (req) => {
  return await ItemPromotionAdjustment.findAll(includeAdjustmentsByDate(req));
};

// Get the Item Fee Adjustment By Date from a marketplace of an account
exports.getItemFeeAdjustmentByDate = async (req) => {
  return await ItemFeeAdjustment.findAll(includeAdjustmentsByDate(req));
};

// Get the PPC Amount By Date
exports.getPPCAmountByDate = async (req, column, where) => {
  const { accountId } = req.account;
  const { startDate, endDate, view, marketplaceId } = req.query;

  let sign = -1;
  if (column !== 'cost') {
    sign = 1;
  }

  return await AdvCampaignRecord.findAll({
    attributes: [
      [fn('date_trunc', view, col('date')), 'type'],
      [literal(sign + ' * (SUM ("' + column + '"))'), 'amount'],
    ],
    include: {
      model: AdvCampaign,
      attributes: [],
      required: true,
      where,
      include: {
        model: AdvProfile,
        attributes: [],
        required: true,
        where: {
          accountId,
          marketplaceId,
        },
      },
    },
    where: {
      date: {
        [Op.gte]: moment(startDate).startOf('day'),
        [Op.lte]: moment(endDate).endOf('day'),
      },
    },
    group: [fn('date_trunc', view, col('date'))],
    order: [fn('date_trunc', view, col('date'))],
    raw: true,
  });
};

// Get COGS By Date
exports.getCOGsByDate = async (req) => {
  const { accountId } = req.account;
  const { startDate, endDate, view, marketplaceId } = req.query;

  return await ProductCost.findAll({
    attributes: [
      [fn('date_trunc', view, col('purchaseDate')), 'type'],
      [
        literal(
          '-1 * (SUM ("quantityShipped" * ("cogsAmount" + "shippingAmount" + "miscAmount")))'
        ),
        'amount',
      ],
    ],
    include: {
      attributes: [],
      model: InventoryItem,
      required: true,
      include: {
        attributes: [],
        model: ShipmentItem,
        as: 'shipmentItems',
        required: true,
        include: {
          attributes: [],
          model: ShipmentEvent,
          required: true,
          include: {
            attributes: [],
            model: Order,
            required: true,
            where: {
              accountId,
              marketplaceId,
              purchaseDate: {
                [Op.and]: [
                  {
                    [Op.gte]: moment(startDate).startOf('day'),
                    [Op.lte]: moment(endDate).endOf('day'),
                  },
                  {
                    [Op.gte]: col('ProductCost.startDate'),
                    [Op.lte]: col('ProductCost.endDate'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    group: [fn('date_trunc', view, col('purchaseDate'))],
    order: [fn('date_trunc', view, col('purchaseDate'))],
    raw: true,
  });
};

exports.getOrdersByDate = async (req, column, where) => {
  const { accountId } = req.account;
  const { startDate, endDate, view, marketplaceId } = req.query;

  let attribute = [
    cast(fn('COUNT', col('Order.amazonOrderId')), 'float'),
    'amount',
  ];
  if (column === 'quantityOrdered') {
    attribute = [cast(fn('SUM', col('quantityOrdered')), 'float'), 'amount'];
  }
  return await Order.findAll({
    attributes: [
      [fn('date_trunc', view, col('purchaseDate')), 'type'],
      attribute,
    ],
    include: {
      attributes: [],
      model: OrderItem,
      required: true,
    },
    where: {
      accountId,
      marketplaceId,
      orderStatus: {
        [Op.ne]: 'Cancelled',
      },
      purchaseDate: {
        [Op.gte]: moment(startDate).startOf('day'),
        [Op.lte]: moment(endDate).endOf('day'),
      },
      ...where,
    },
    group: [fn('date_trunc', view, col('purchaseDate'))],
    order: [fn('date_trunc', view, col('purchaseDate'))],
    raw: true,
  });
};

const getUnitOrderPerProduct = async (where) => {
  const sql = `select 
                ii.asin,
                count(o."amazonOrderId") as "orders",
                case
                  when SUM(oi."quantityOrdered") is null
                  then 0
                  else SUM(oi."quantityOrdered")
                end as "units"
              from "inventoryItems" ii
              left join "orderItems" oi on oi.asin = ii.asin
              left join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getReturnsPerProduct = async (where) => {
  const sql = `select 
                ii.asin,
                count(o."amazonOrderId") as "returns"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "refundEvents" re on re."amazonOrderId" = o."amazonOrderId"
              join "shipmentAdjustmentItems" sai on sai."amazonOrderId" = o."amazonOrderId"
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getTotalPromotionsPerProduct = async (where) => {
  const sql = `select  ii.asin,count(ip."itemPromotionId") as "promotions"
              from "inventoryItems" ii
              left join "orderItems" oi on oi.asin = ii.asin
              left join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              left join "shipmentEvents" as se on se."amazonOrderId" = o."amazonOrderId"
              left join "shipmentItems" as si on si."shipmentEventId" = se."shipmentEventId"
              left join "itemPromotions" as ip on ip."shipmentItemId" = si."shipmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getItemChargesPerProduct = async (where) => {
  const sql = `select 
                ii.asin,
                case
                    when SUM(ic."currencyAmount") IS NULL
                    then 0
                    else SUM(ic."currencyAmount")
                end as "ic"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "shipmentEvents" AS se on o."amazonOrderId" = se."amazonOrderId"
              join "shipmentItems" AS si on si."shipmentEventId" = se."shipmentEventId"
              join "itemCharges" AS ic on ic."shipmentItemId" = si."shipmentItemId"
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getItemChargeAdjutmentsPerProduct = async (where) => {
  const sql = `select 
                ii.asin,
                case
                    when SUM(ica."currencyAmount") IS NULL
                    then 0
                    else SUM(ica."currencyAmount")
                end as "ica"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "refundEvents" AS re on o."amazonOrderId" = re."amazonOrderId"
              join "shipmentAdjustmentItems" AS sai on sai."refundEventId" = re."refundEventId"
              join "itemChargeAdjustments" AS ica 
                on ica."shipmentAdjustmentItemId" = sai."shipmentAdjustmentItemId"
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getPromotionsPerProduct = async (where) => {
  const sql = `select  
                  ii.asin,
                  case
                    when SUM(ip."currencyAmount") IS NULL
                    then 0
                    else SUM(ip."currencyAmount")
                  end as "ip"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "shipmentEvents" as se on se."amazonOrderId" = o."amazonOrderId"
              join "shipmentItems" as si on si."shipmentEventId" = se."shipmentEventId"
              join "itemPromotions" as ip on ip."shipmentItemId" = si."shipmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getPromotionAdjustmentsPerProduct = async (where) => {
  const sql = `select  
                  ii.asin,
                  case
                    when SUM(ipa."currencyAmount") IS NULL
                    then 0
                    else SUM(ipa."currencyAmount")
                  end as "ipa"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "refundEvents" AS re on o."amazonOrderId" = re."amazonOrderId"
              join "shipmentAdjustmentItems" AS sai on sai."refundEventId" = re."refundEventId"
              join "itemPromotionAdjustments" as ipa 
                on ipa."shipmentAdjustmentItemId" = sai."shipmentAdjustmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getItemWithheldTaxesPerProduct = async (where) => {
  const sql = `select  
                  ii.asin,
                  case
                    when SUM(iwt."currencyAmount") IS NULL
                    then 0
                    else SUM(iwt."currencyAmount")
                  end as "iwt"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "shipmentEvents" as se on se."amazonOrderId" = o."amazonOrderId"
              join "shipmentItems" as si on si."shipmentEventId" = se."shipmentEventId"
              join "itemWithheldTaxes" as iwt on iwt."shipmentItemId" = si."shipmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getItemTaxWithheldAdjustmentsPerProduct = async (where) => {
  const sql = `select  
                  ii.asin,
                  case
                    when SUM(itwa."currencyAmount") IS NULL
                    then 0
                    else SUM(itwa."currencyAmount")
                  end as "itwa"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "refundEvents" AS re on o."amazonOrderId" = re."amazonOrderId"
              join "shipmentAdjustmentItems" AS sai on sai."refundEventId" = re."refundEventId"
              join "itemTaxWithheldAdjustments" as itwa 
                on itwa."shipmentAdjustmentItemId" = sai."shipmentAdjustmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getItemFeesPerProduct = async (where) => {
  const sql = `select  
                  ii.asin,
                  case
                    when SUM(if."currencyAmount") IS NULL
                    then 0
                    else SUM(if."currencyAmount")
                  end as "ifs"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "shipmentEvents" as se on se."amazonOrderId" = o."amazonOrderId"
              join "shipmentItems" as si on si."shipmentEventId" = se."shipmentEventId"
              join "itemFees" as if on if."shipmentItemId" = si."shipmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getItemFeeAdjustmentsPerProduct = async (where) => {
  const sql = `select  
                  ii.asin,
                  case
                    when SUM(ifa."currencyAmount") IS NULL
                    then 0
                    else SUM(ifa."currencyAmount")
                  end as "ifsa"
              from "inventoryItems" ii
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "refundEvents" AS re on o."amazonOrderId" = re."amazonOrderId"
              join "shipmentAdjustmentItems" AS sai on sai."refundEventId" = re."refundEventId"
              join "itemFeeAdjustments" as ifa 
                on ifa."shipmentAdjustmentItemId" = sai."shipmentAdjustmentItemId"	
              ${where}`;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getPPCPerProduct = async (where) => {
  const sql = `select
                ii.asin,
                -1 * (case
                  when SUM(cost) is null
                  then 0
                  else SUM(cost)
                end) as "ppcSpend",
                case
                  when SUM("attributedSales30d") is null
                  then 0
                  else SUM("attributedSales30d")
                end as "ppcSales"
              from "advProductAdRecords" as apar
              inner join "advProductAds" as apa on
                apar."advProductAdId" = apa."advProductAdId"
              inner join "advAdGroups" as aag on
                apa."advAdGroupId" = aag."advAdGroupId"
              inner join "advCampaigns" as ac on
                aag."advCampaignId" = ac."advCampaignId"
              inner join "advProfiles" as ap on
                ac."advProfileId" = ap."advProfileId"
              inner join "inventoryItems" as ii on ii.asin = apa.asin
                and ii."accountId" = ap."accountId"
                and ii."marketplaceId" = ap."marketplaceId"
              ${where}
              `;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getCOGSPerProduct = async (where) => {
  const sql = `select 
                ii.asin,
                (-1 *(SUM(si."quantityShipped" * (pc."cogsAmount" + pc."shippingAmount" + pc."miscAmount")))) as "cogs"
              from "inventoryItems" ii
              join "productCosts" pc on pc."inventoryItemId" = ii."inventoryItemId"
              join "orderItems" oi on oi.asin = ii.asin
              join orders o on o."amazonOrderId" = oi."amazonOrderId"
                and o."accountId" = ii."accountId"
                and o."marketplaceId" = ii."marketplaceId"
              join "shipmentEvents" as se on o."amazonOrderId" = se."amazonOrderId"
              join "shipmentItems" as si on si."shipmentEventId" = se."shipmentEventId"
              ${where}
              `;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const mProdData = (...args) => {
  const config = _.chain(args).filter(_.isString).value();

  const key = _.get(config, '[0]');
  // o = override
  const strategy = _.get(config, '[1]') === 'o' ? _.merge : _.defaultsDeep;

  // Set Defaults
  const fields = _.get(config, '[2]').split(',');
  let defaults = {};
  _.each(fields, (f) => {
    let temp = {};
    temp[f] = 0;
    defaults = { ...defaults, ...temp };
  });

  if (!_.isString(key)) throw new Error('missing key');

  const datasets = _.chain(args).reject(_.isEmpty).filter(_.isArray).value();

  const datasetsIndex = _.mapValues(datasets, (dataset) =>
    _.keyBy(dataset, key)
  );

  const uniqKeys = _.chain(datasets).flatten().map(key).uniq().value();

  return _.chain(uniqKeys)
    .map((val) => {
      const data = {};
      _.each(datasetsIndex, (dataset) => {
        if (dataset[val]) {
          let toMerge = dataset[val];
          for (const [key, value] of Object.entries(toMerge)) {
            if (fields.includes(key)) {
              toMerge[key] = parseFloat(value);
            }
          }
          strategy(data, toMerge);
        } else {
          strategy(data, defaults);
        }
      });
      return data;
    })
    .filter(key)
    .value();
};

exports.getProducts = async (req) => {
  const { accountId } = req.account;
  const {
    pageSize,
    page,
    sortField,
    sortOrder,
    startDate,
    endDate,
    marketplaceId,
    searchQuery,
  } = req.query;

  const start = moment(startDate).startOf('day').format('YYYY-MM-DD');
  const end = moment(endDate).endOf('day').format('YYYY-MM-DD');

  const listingQuery = {
    model: Listing,
    as: 'listings',
    attributes: [],
    where: { marketplaceId },
  };

  const productQuery = [
    {
      model: Product,
      as: 'product',
      attributes: [],
      include: listingQuery,
    },
  ];

  const inventoryItemQuery = {
    attributes: [
      'asin',
      'sellerSku',
      'productName',
      'product.listings.title',
      'product.listings.thumbnail',
      'product.listings.status',
    ],
    where: {
      accountId,
      marketplaceId,
    },
    include: productQuery,
    raw: true,
    subQuery: false,
  };

  let searchLikeQuery = '';
  if (searchQuery) {
    inventoryItemQuery.where[Op.and] = {
      [Op.or]: ['asin', 'sellerSku', 'productName'].map((attribute) => {
        return {
          [attribute]: {
            [Op.iLike]: `%${searchQuery}%`,
          },
        };
      }),
    };
    searchLikeQuery = `and (
                        ii.asin iLike '%${searchQuery}%' or
                        ii."sellerSku" iLike '%${searchQuery}%' or
                        ii."productName" iLike '%${searchQuery}%'
                      )`;
  }

  let products = await InventoryItem.findAll(inventoryItemQuery);

  const where = {
    orders: `
    where
      ii."accountId" = '${accountId}'
      and ii."marketplaceId" = '${marketplaceId}'
      and o."purchaseDate" >= '${start}'
      and o."purchaseDate" <= '${end}'
      and o."orderStatus" <> 'Cancelled'
      ${searchLikeQuery}
    group by
      ii.asin`,
    cogs: `
    where
      ii."accountId" = '${accountId}'
      and ii."marketplaceId" = '${marketplaceId}'
      and o."purchaseDate" >= '${start}'
      and o."purchaseDate" <= '${end}'
      and o."purchaseDate" >= pc."startDate"
      and o."purchaseDate" <= pc."endDate"
      and o."orderStatus" <> 'Cancelled'
      ${searchLikeQuery}
    group by
      ii.asin`,
    ppc: `
      where
        ap."accountId" = '${accountId}'
        and ap."marketplaceId" = '${marketplaceId}'
        and apar."date" >= '${start}'
        and apar."date" <= '${end}'
        ${searchLikeQuery}
      group by
        ii.asin`,
  };

  const orders = await getUnitOrderPerProduct(where.orders);
  const returns = await getReturnsPerProduct(where.orders);
  const promotions = await getTotalPromotionsPerProduct(where.orders);
  const ic = await getItemChargesPerProduct(where.orders);
  const ica = await getItemChargeAdjutmentsPerProduct(where.orders);
  const ip = await getPromotionsPerProduct(where.orders);
  const ipa = await getPromotionAdjustmentsPerProduct(where.orders);
  const iwt = await getItemWithheldTaxesPerProduct(where.orders);
  const itwa = await getItemTaxWithheldAdjustmentsPerProduct(where.orders);
  const ifs = await getItemFeesPerProduct(where.orders);
  const ifsa = await getItemFeeAdjustmentsPerProduct(where.orders);
  const ppc = await getPPCPerProduct(where.ppc);
  const cogs = await getCOGSPerProduct(where.cogs);

  // Prepare the list
  products = mProdData(products, orders, 'asin', 'o', 'units,orders');
  products = mProdData(products, returns, 'asin', 'o', 'returns');
  products = mProdData(products, promotions, 'asin', 'o', 'promotions');
  products = mProdData(products, ic, 'asin', 'o', 'ic');
  products = mProdData(products, ica, 'asin', 'o', 'ica');
  products = mProdData(products, ip, 'asin', 'o', 'ip');
  products = mProdData(products, ipa, 'asin', 'o', 'ipa');
  products = mProdData(products, iwt, 'asin', 'o', 'iwt');
  products = mProdData(products, itwa, 'asin', 'o', 'itwa');
  products = mProdData(products, ifs, 'asin', 'o', 'ifs');
  products = mProdData(products, ifsa, 'asin', 'o', 'ifsa');
  products = mProdData(products, ppc, 'asin', 'o', 'ppcSpend,ppcSales');
  products = mProdData(products, cogs, 'asin', 'o', 'cogs');

  products = products.map((p) => {
    const ic = p.ic ? p.ic : 0;
    const ip = p.ip ? p.ip : 0;
    const iwt = p.iwt ? p.iwt : 0;
    const ica = p.ica ? p.ica : 0;
    const ipa = p.ipa ? p.ipa : 0;
    const itwa = p.itwa ? p.itwa : 0;
    const ifs = p.ifs ? p.ifs : 0;
    const ifsa = p.ifsa ? p.ifsa : 0;
    const cogs = p.cogs ? p.cogs : 0;
    const ppcSpend = p.ppcSpend ? p.ppcSpend : 0;
    const ppcSales = p.ppcSales ? p.ppcSales : 0;

    const sales = +(ic + ip + iwt).toFixed(2);
    const refunds = +(ica + ipa + itwa).toFixed(2);
    const fees = +(ifs + ifsa).toFixed(2);
    const revenue = +(sales + refunds).toFixed(2);
    const costs = +(fees + ppcSpend + cogs).toFixed(2);
    return {
      asin: p.asin,
      sellerSku: p.sellerSku ? p.sellerSku : '',
      productName: p.productName ? p.productName : '',
      title: p.title ? p.title : '',
      thumbnail: p.thumbnail ? p.thumbnail : '',
      status: p.status ? p.status : '',
      units: p.units,
      orders: p.orders,
      refunds,
      promotions: p.promotions,
      revenue,
      costs: cogs,
      fees,
      ppcSpend,
      ppcSales,
      profit: +(revenue + costs).toFixed(2),
    };
  });

  // Sort
  if (sortField && sortOrder) {
    let field = sortField;
    if (sortField === 'productName') {
      field = (product) => product.productName.toLowerCase();
    }

    products = _.orderBy(products, [field], [sortOrder]);
  }
  // Limit and Offset
  const rows = _(products)
    .drop((page - 1) * pageSize) // page in drop function starts from 0
    .take(pageSize)
    .value();

  return {
    count: products.length,
    rows,
  };
};

exports.getFeesBreakdownByProduct = async (req) => {
  const { accountId } = req.account;
  const { startDate, endDate, marketplaceId, asin } = req.query;

  const start = moment(startDate).startOf('day').format('YYYY-MM-DD');
  const end = moment(endDate).endOf('day').format('YYYY-MM-DD');

  let fees = [];
  let feeAdjustments = [];

  let asinWhere = '';

  if (asin) {
    asinWhere = `and ii.asin = '${asin}'`;
  }
  const commonSql = `
    case
      when SUM(fees."currencyAmount") is null
      then 0
      else SUM(fees."currencyAmount")
    end as "amount"
    from
      "inventoryItems" ii
    join "orderItems" oi on
      oi.asin = ii.asin
    join orders o on
      o."amazonOrderId" = oi."amazonOrderId"
      and o."accountId" = ii."accountId"
      and o."marketplaceId" = ii."marketplaceId"
  `;

  const where = `
    where
      ii."accountId" = '${accountId}'
      and ii."marketplaceId" = '${marketplaceId}'
      and o."purchaseDate" >= '${start}'
      and o."purchaseDate" <= '${end}'
      and o."orderStatus" <> 'Cancelled'
      ${asinWhere}
    `;

  const feesSql = `
    select
      ii.asin,
      fees."feeType" as "type",
    ${commonSql}
    join "shipmentEvents" as se on
      se."amazonOrderId" = o."amazonOrderId"
    join "shipmentItems" as si on
      si."shipmentEventId" = se."shipmentEventId"
    join "itemFees" as fees on
      fees."shipmentItemId" = si."shipmentItemId"
    ${where}
    group by ii.asin,fees."feeType"
    `;

  fees = await sequelize.query(feesSql, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  const feeAdjustmentsSql = `
    select
      ii.asin,
      fees."chargeType" as "type",
    ${commonSql}
    join "refundEvents" as re on
	    o."amazonOrderId" = re."amazonOrderId"
    join "shipmentAdjustmentItems" as sai on
      sai."refundEventId" = re."refundEventId"
    join "itemFeeAdjustments" as fees  on
      fees."shipmentAdjustmentItemId" = sai."shipmentAdjustmentItemId"
    ${where}
    group by ii.asin,fees."chargeType"
    `;

  feeAdjustments = await sequelize.query(feeAdjustmentsSql, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  let combineFees = [];
  let allFees = [...fees, ...feeAdjustments];
  allFees.map((fee) => {
    const index = combineFees.findIndex((e) => e.asin === fee.asin);
    if (index !== -1) {
      const index2 = combineFees[index].types.findIndex(
        (e) => e.type === fee.type
      );
      if (index2 !== -1) {
        combineFees[index].types[index2].amount = +(
          combineFees[index].types[index2].amount + parseFloat(fee.amount)
        ).toFixed(2);
      } else {
        combineFees[index].types.push({
          type: fee.type,
          amount: +parseFloat(fee.amount).toFixed(2),
        });
      }
    } else {
      combineFees.push({
        asin: fee.asin,
        types: [
          {
            type: fee.type,
            amount: +parseFloat(fee.amount).toFixed(2),
          },
        ],
      });
    }
  });

  return combineFees;
};
