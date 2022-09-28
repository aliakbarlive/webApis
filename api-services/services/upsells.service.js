const { compact, upperCase, sum, isEqual, pick, keys } = require('lodash');
const { Op } = require('sequelize');
const {
  Upsell,
  UpsellItem,
  UpsellDetail,
  UpsellLog,
  UpsellComment,
  UpsellOrder,
  User,
  AgencyClient,
  Account,
  Subscription,
} = require('../models');
const { updateCustomField, getInvoice } = require('./invoice.service');
const { addCharge, getSubscription } = require('./subscription.service');
const Response = require('@utils/response');
const sendRawEmail = require('../queues/ses/sendRawEmail');
const path = require('path');
const fs = require('fs');

/**
 * Get Upsells
 * @param {object} data
 * @returns {rows} upsells list
 */
const getUpsells = async (data) => {
  const { sort, pageSize: limit, pageOffset: offset, status, client } = data;
  let order = sort;

  let options = {
    include: [
      {
        model: UpsellDetail,
        as: 'details',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['createdAt', 'ASC']],
      },
      {
        model: AgencyClient,
        as: 'agencyClient',
        attributes: ['client'],
        include: [
          {
            model: Account,
            as: 'account',
            attributes: ['accountId'],
            include: {
              model: Subscription,
              as: 'subscription',
              attributes: ['subscriptionId'],
            },
          },
          {
            model: User,
            as: 'defaultContact',
            attributes: ['firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: User,
        as: 'requestedByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'approvedByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'soldByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
      {
        model: UpsellOrder,
        as: 'order',
        attributes: ['upsellOrderId'],
      },
    ],
    where: {},
    order,
    limit,
    offset,
  };

  if (client) {
    options.where.agencyClientId = {
      [Op.eq]: client,
    };
  }

  if (status) {
    options.where.status = {
      [Op.eq]: status,
    };
  }

  const out = await Upsell.findAndCountAll(options);

  return out;
};

/**
 * Get Upsell
 * @param {uuid} upsellId
 * @returns {<Upsell>}
 */
const getUpsell = async (upsellId) => {
  return await Upsell.findByPk(upsellId, {
    include: [
      {
        model: UpsellDetail,
        as: 'details',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['createdAt', 'ASC']],
      },
      {
        model: AgencyClient,
        as: 'agencyClient',
        attributes: ['client'],
        include: [
          {
            model: Account,
            as: 'account',
            attributes: ['accountId'],
            include: {
              model: Subscription,
              as: 'subscription',
              attributes: ['subscriptionId'],
            },
          },
          {
            model: User,
            as: 'defaultContact',
            attributes: ['firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: User,
        as: 'requestedByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'approvedByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'soldByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
      {
        model: UpsellOrder,
        as: 'order',
        attributes: ['upsellOrderId'],
      },
    ],
  });
};

/**
 * Create Upsell
 * @param {object} data
 * @returns {<Upsell>}
 */
const createUpsell = async (data, userId) => {
  const upsell = await Upsell.create(pick(data, keys(Upsell.rawAttributes)));

  const details = data.details.map((d) => {
    return {
      upsellId: upsell.upsellId,
      ...d,
    };
  });

  await UpsellDetail.bulkCreate(details);

  const out = await Upsell.findByPk(upsell.upsellId, {
    include: {
      model: UpsellDetail,
      as: 'details',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });

  await createUpsellLog({
    upsellId: upsell.upsellId,
    description: 'Upsell created',
    addedBy: userId,
  });

  if (data.note) {
    await createUpsellLog({
      upsellId: upsell.upsellId,
      description: data.note,
      addedBy: userId,
      isSystemGenerated: false,
    });
  }

  return { out };
};

/**
 * Update Upsell
 * @param {object} data
 * @returns {<Upsell>}
 */
const updateUpsell = async (id, data, userId) => {
  const upsell = await Upsell.findByPk(id);
  const values = {
    ...data,
    approvedBy:
      upsell.status !== 'approved' && data.status === 'approved'
        ? userId
        : null,
    approvedAt:
      upsell.status !== 'approved' && data.status === 'approved'
        ? Date.now()
        : null,
  };
  let logItems = [];

  if (!isEqual(upsell.status, data.status)) {
    logItems.push(`Status updated to ${upperCase(data.status)}`);
  }

  await upsell.update(values);

  const details = await UpsellDetail.findAll({
    where: { upsellId: upsell.upsellId },
  });
  const curentItems = details.map((detail) => detail.upsellDetailId);
  const keepItems = data.details.map((detail) => detail.upsellDetailId);

  await UpsellDetail.destroy({
    where: {
      upsellId: upsell.upsellId,
      upsellDetailId: { [Op.notIn]: compact(keepItems) },
    },
  });

  data.details.forEach(async (detail) => {
    const {
      upsellDetailId,
      upsellId,
      addonId,
      code,
      name,
      description,
      qty,
      price,
      type,
    } = detail;

    let data = {
      upsellId,
      addonId,
      code,
      name,
      description,
      qty,
      price,
      type,
    };

    if (upsellDetailId !== '') {
      data = { upsellDetailId, ...data };
    }

    await UpsellDetail.upsert(data);
  });

  if (!isEqual(curentItems.sort(), keepItems.sort())) {
    logItems.push(`Items updated`);
  }

  if (logItems.length > 0) {
    createUpsellLog({
      upsellId: upsell.upsellId,
      description: logItems.join('.\n '),
      addedBy: userId,
    });
  }

  const out = await getUpsell(id);
  return { out };
};

/**
 * Update Upsell
 * @param {object} data
 * @returns {<Upsell>}
 */
const updateUpsellStatus = async (id, data, userId) => {
  const upsell = await Upsell.findByPk(id);

  let description = '';
  if (data.status === 'pending' && upsell.status === 'rejected') {
    description = 'Reopened';
  }

  await upsell.update(data);

  createUpsellLog({
    upsellId: upsell.upsellId,
    description,
    addedBy: userId,
  });

  const out = await getUpsell(id);

  return { out };
};

/**
 * Delete Upsell Item
 * @param {uuid} data
 * @returns {boolean}
 */
const deleteUpsell = async (upsellId) => {
  await UpsellDetail.destroy({ where: { upsellId } });
  await UpsellLog.destroy({ where: { upsellId } });
  return await Upsell.destroy({ where: { upsellId } });
};

const sendBillingSummary = async (upsellId, subscriptionId, userId) => {
  const upsell = await Upsell.findByPk(upsellId, {
    include: [
      {
        model: UpsellDetail,
        as: 'details',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['createdAt', 'ASC']],
      },
      {
        model: AgencyClient,
        as: 'agencyClient',
        attributes: ['client'],
        include: [
          {
            model: User,
            as: 'defaultContact',
            attributes: ['firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: User,
        as: 'requestedByUser',
        attributes: ['email', 'firstName', 'lastName'],
      },
    ],
  });

  const subscription = await getSubscription(subscriptionId);

  let filePath = path.join(
    __dirname,
    `../email-templates/upsell-billing-summary.html`
  );

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );
  const subject = `BetterSeller Upsell Billing Summary - ${upsell.agencyClient.client}`;

  let itemsPath = path.join(
    __dirname,
    `../email-templates/upsell-billing-summary-items.html`
  );

  let itemsTemplate = fs.readFileSync(
    itemsPath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let subTotal = 0;
  let message = '';
  let items = '';
  if (upsell.details.length > 1) {
    items = upsell.details
      .map((detail) => {
        const { name, description, price, qty } = detail;
        const itemTotal = parseFloat(price) * parseInt(qty);
        return itemsTemplate
          .replace('{{item}}', name)
          .replace('{{description}}', description)
          .replace('{{qty}}', qty)
          .replace('{{unit_price}}', price)
          .replace('{{price}}', itemTotal.toFixed(2));
      })
      .join('');

    subTotal = sum(
      upsell.details.map((detail) => {
        return parseFloat(detail.price) * parseInt(detail.qty);
      })
    );
  } else {
    const { name, description, price, qty } = upsell.details[0];

    items = itemsTemplate
      .replace('{{item}}', name)
      .replace('{{description}}', description)
      .replace('{{qty}}', qty)
      .replace('{{unit_price}}', price)
      .replace('{{price}}', parseFloat(price) * parseInt(qty));

    subTotal = parseFloat(price) * parseInt(qty);
  }

  const taxes = subTotal * (parseFloat(subscription.tax_percentage ?? 0) / 100);
  const total = subTotal + taxes;

  message = template
    .replace('{{client}}', upsell.agencyClient.client)
    .replace('{{items}}', items)
    .replace('{{subtotal_price}}', subTotal.toFixed(2))
    .replace(
      '{{tax_name}}',
      subscription.tax_name ?? subscription.tax_exemption_code
    )
    .replace('{{tax_percentage}}', subscription.tax_percentage ?? 0)
    .replace('{{tax}}', taxes > 0 ? `$${taxes.toFixed(2)}` : '-')
    .replace('{{total}}', total.toFixed(2))
    .replace(
      '{{payment_url}}',
      `${process.env.SITE_URL}/upsells-billing-preview/${upsellId}`
    );

  const cc = [upsell.requestedByUser.email];
  const bcc = [process.env.SALES_ADMIN_CC];

  const out = await sendRawEmail.add(
    {
      email: upsell.agencyClient.defaultContact.email,
      subject,
      message,
      cc,
      bcc,
    },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );

  if (out) {
    createUpsellLog({
      upsellId: upsell.upsellId,
      description: `Billing summary sent to ${upsell.agencyClient.defaultContact.email}`,
      addedBy: userId,
    });
  }

  return { upsell, out };
};

/**
 * Charge Customer with Upsell Request. An upsell order will be generated if the invoice status is paid
 * @param {uuid} upsellId
 * @param {string} subscriptionId
 * @param {uuid} userId
 * @returns {boolean}
 */
const generateUpsellInvoice = async (upsellId, subscriptionId, userId) => {
  const upsell = await Upsell.findByPk(upsellId, {
    include: [
      {
        model: UpsellDetail,
        as: 'details',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['createdAt', 'ASC']],
      },
    ],
  });

  let amount = 0;
  let description = '';
  if (upsell.details.length > 1) {
    description = upsell.details
      .map((detail) => {
        const { name, description, price, qty } = detail;
        return `Item: ${name}\nDescription: ${description}\nQuantity: ${qty}\nUnit Price: $${price}`;
      })
      .join('\n-----\n');

    amount = sum(
      upsell.details.map((detail) => {
        return parseFloat(detail.price) * parseInt(detail.qty);
      })
    );

    description = `${description}\n------------------------------\nTotal: $${amount}`;
  } else {
    const { name, description: desc, price, qty } = upsell.details[0];
    amount = parseFloat(price) * parseInt(qty);
    description = `Item: ${name}\nDescription: ${desc}\nQuantity: ${qty}\nUnit Price: $${price}\n------------------------------\nTotal: $${amount}`;
  }

  const out = await addCharge(
    {
      amount,
      description,
      add_to_unbilled_charges: false,
    },
    subscriptionId
  );

  if (out.code === 0) {
    const {
      invoice_id: invoiceId,
      status: invoiceStatus,
      invoice_date: invoiceDate,
      number: invoiceNumber,
    } = out.invoice;

    await upsell.update({
      invoiceId,
      invoiceNumber,
      invoiceStatus,
      invoiceDate,
      status: invoiceStatus === 'paid' ? 'approved' : upsell.status,
    });

    createUpsellLog({
      upsellId: upsellId,
      description: `Invoice created - ${upperCase(invoiceStatus)}`,
      addedBy: userId,
    });

    await updateCustomField(invoiceId, 'upsell', 'yes');

    if (invoiceStatus === 'paid') {
      const order = await createUpsellOrder(
        {
          upsellId: upsellId,
          status: 'pending',
        },
        userId
      );
      createUpsellLog({
        upsellId: upsellId,
        description: `Order created`,
        addedBy: userId,
      });
      return order;
    }
    return out;
  }

  return out;
};

const checkInvoiceStatus = async (upsellId, userId) => {
  const upsell = await Upsell.findByPk(upsellId);
  const output = await getInvoice(upsell.invoiceId);

  if (output.code === 0) {
    await upsell.update({ invoiceStatus: output.invoice.status });

    if (output.invoice.status === 'paid') {
      const order = await UpsellOrder.findOne({ where: { upsellId } });
      if (!order) {
        const order = await createUpsellOrder(
          {
            upsellId: upsellId,
            status: 'pending',
          },
          userId
        );
        await createUpsellLog({
          upsellId: upsellId,
          description: `Order created`,
          addedBy: userId,
        });
        return { order, message: 'Paid. Order Created' };
      }
      return { message: 'Paid. Order Exists' };
    }
    return { message: output.invoice.status };
  }
  return output;
};

/**
 * Get Upsell Orders
 * @param {object} data
 * @returns {rows} upsell orders list
 */
const getUpsellOrders = async (data) => {
  const { sort, pageSize: limit, pageOffset: offset, status, client } = data;
  let order = sort;

  let options = {
    include: [
      {
        model: Upsell,
        as: 'upsell',
        ...(client && {
          where: { agencyClientId: { [Op.eq]: client } },
        }),
        include: [
          {
            model: UpsellDetail,
            as: 'details',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['createdAt', 'ASC']],
          },
          {
            model: AgencyClient,
            as: 'agencyClient',
            attributes: ['client'],
          },
          {
            model: User,
            as: 'requestedByUser',
            attributes: ['email', 'firstName', 'lastName'],
          },
        ],
      },
      {
        model: User,
        as: 'assignedToUser',
      },
    ],
    where: {},
    order,
    limit,
    offset,
  };

  if (status) {
    options.where.status = {
      [Op.eq]: status,
    };
  }

  const out = await UpsellOrder.findAndCountAll(options);

  return out;
};

/**
 * Get Upsell Order
 * @param {uuid} upsellOrderId
 * @returns {<Upsell>}
 */
const getUpsellOrder = async (upsellOrderId) => {
  return await UpsellOrder.findByPk(upsellOrderId, {
    include: [
      {
        model: Upsell,
        as: 'upsell',
        include: [
          {
            model: UpsellDetail,
            as: 'details',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['createdAt', 'ASC']],
          },
          {
            model: AgencyClient,
            as: 'agencyClient',
            attributes: ['client'],
          },
          {
            model: User,
            as: 'requestedByUser',
            attributes: ['email', 'firstName', 'lastName'],
          },
        ],
      },
      {
        model: User,
        as: 'assignedToUser',
      },
    ],
  });
};

/**
 * Create Upsell Order
 * @param {object} data
 * @returns {<UpsellOrder>}
 */
const createUpsellOrder = async (data, userId) => {
  const out = await UpsellOrder.create(data);

  createUpsellOrderHistory({
    upsellOrderId: out.upsellOrderId,
    comment: 'Order Created',
  });

  return { out };
};

/**
 * Update Upsell Order
 * @param {uuid} id
 * @param {object} data
 * @returns {<UpsellOrder>}
 */
const updateUpsellOrder = async (id, data, userId) => {
  const upsellOrder = await UpsellOrder.findByPk(id);

  let comment = '';
  if (!upsellOrder.startedAt && data.startedAt) {
    comment = 'Order started';
  }
  if (!upsellOrder.completedAt && data.completedAt) {
    comment = 'Order completed';
  }
  if (!upsellOrder.eta && data.eta) {
    comment = `${comment} ETA added`;
  } else {
    if (data.eta !== upsellOrder.eta) comment = `${comment} ETA updated`;
  }

  if (data.assignedTo) {
    let assigned = 'Assigned';
    if (!upsellOrder.assignedTo) {
      comment =
        comment !== '' ? `Assigned to user. ${comment}` : `Order Assigned`;
    } else {
      if (upsellOrder.assignedTo !== data.assignedTo) {
        assigned = 'Reassigned';
        comment =
          comment !== ''
            ? `${assigned} to user. ${comment}`
            : `Order ${assigned}`;
      }
    }
  }

  const out = await upsellOrder.update(data);

  if (comment !== '') {
    createUpsellOrderHistory({
      upsellOrderId: out.upsellOrderId,
      comment,
    });
  }
  return { out };
  //return details;
};

/**
 * Delete Upsell Order
 * @param {uuid} upsellOrderId
 * @returns {<Boolean>}
 */
const deleteUpsellOrder = async (upsellOrderId) => {
  return await UpsellOrder.destroy({ where: { upsellOrderId } });
  //return details;
};

/**
 * Get Upsell Items
 * @param {object} data
 * @returns {rows} upsell items list
 */
const getUpsellItems = async (data) => {
  const { sort, pageSize: limit, pageOffset: offset, status } = data;
  let order = sort;

  const out = await UpsellItem.findAndCountAll({
    //where: { status },
    order,
    limit,
    offset,
  });

  return out;
};

/**
 * Get All Upsell Items
 * @param {object} data
 * @returns {rows} upsell items list
 */
const getUpsellItemsList = async (data) => {
  const out = await UpsellItem.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [['name', 'ASC']],
  });

  return out;
};

/**
 * Get Upsell Item
 * @param {uuid} upsellItem
 * @returns {<Upsell>}
 */
const getUpsellItem = async (upsellItemId) => {
  return await UpsellItem.findByPk(upsellItemId);
};

/**
 * Create Upsell Item
 * @param {object} data
 * @returns {<UpsellItem>}
 */
const createUpsellItem = async (data) => {
  const out = await UpsellItem.create(data);

  return { out };
};

/**
 * Update Upsell Item
 * @param {uuid} id
 * @param {object} data
 * @returns {<UpsellItem>}
 */
const updateUpsellItem = async (id, data) => {
  const upsellItem = await UpsellItem.findByPk(id);
  const out = await upsellItem.update(data);

  return { out };
};

/**
 * Delete Upsell Item
 * @param {object} data
 * @returns {boolean}
 */
const deleteUpsellItem = async (upsellItemId) => {
  try {
    return await UpsellItem.destroy({ where: { upsellItemId } });
  } catch (error) {
    return false;
    //console.log(error.message, 'eee');
  }
};

/**
 * Get Logs By Upsell
 * @param {uuid} upsellId
 * @returns {boolean}
 */
const getUpsellLogs = async (upsellId) => {
  return await UpsellLog.findAll({
    attributes: [
      'upsellLogId',
      'description',
      'createdAt',
      'isSystemGenerated',
    ],
    where: {
      upsellId,
    },
    order: [['updatedAt', 'desc']],
    include: {
      model: User,
      as: 'addedByUser',
      attributes: ['userId', 'firstName', 'lastName', 'email'],
    },
  });
};

/**
 * Create a log by upsell
 * @param {object} data
 * @returns {boolean}
 */
const createUpsellLog = async (data) => {
  return await UpsellLog.create(data);
};

/**
 * Delete upsell log.
 *
 * @param {uuid} upsellId
 * @param {uuid} upsellLogId
 * @param {uuid} userId
 * @returns {Promise<Response>} response
 */
const deleteUpsellLog = async (upsellId, upsellLogId, userId) => {
  const upsellLog = await UpsellLog.findOne({
    where: {
      upsellLogId,
      upsellId,
    },
  });

  if (!upsellLog) {
    return new Response().withCode(404).withMessage('Log not found');
  }

  if (upsellLog.isSystemGenerated) {
    return new Response()
      .withCode(400)
      .withMessage('System generated logs cannot be deleted');
  }

  if (upsellLog.addedBy !== userId) {
    return new Response().withCode(403).withMessage('Forbidden');
  }

  await upsellLog.destroy();

  return new Response().withMessage('Upsell Log successfully deleted');
};

/**
 * Get Comments By Upsell Order
 * @param {uuid} upsellOrderId
 * @returns {boolean}
 */
const getUpsellOrderComments = async (upsellOrderId) => {
  return await UpsellComment.findAll({
    attributes: ['upsellCommentId', 'comment', 'createdAt', 'updatedAt'],
    where: {
      upsellOrderId,
    },
    order: [['updatedAt', 'desc']],
    include: {
      model: User,
      as: 'commentedByUser',
      attributes: ['userId', 'firstName', 'lastName', 'email'],
    },
  });
};

/**
 * Create a comment by Upsell Order
 * @param {object} data
 * @returns {boolean}
 */
const createUpsellOrderComment = async (data) => {
  return await UpsellComment.create(data);
};

/**
 * Create history by Upsell Order
 * @param {object} data
 * @returns {boolean}
 */
const createUpsellOrderHistory = async ({ upsellOrderId, comment }) => {
  return await UpsellComment.create({
    upsellOrderId,
    comment,
    commentedBy: process.env.ADMIN_USER_ID,
  });
};

/**
 * Delete Upsell Order Comment
 * @param {uuid} upsellCommentId
 * @returns {boolean}
 */
const deleteUpsellOrderComment = async (upsellCommentId) => {
  return await UpsellComment.destroy({ where: { upsellCommentId } });
};

module.exports = {
  getUpsells,
  getUpsell,
  createUpsell,
  updateUpsell,
  updateUpsellStatus,
  deleteUpsell,
  getUpsellItems,
  getUpsellItemsList,
  getUpsellItem,
  createUpsellItem,
  updateUpsellItem,
  deleteUpsellItem,
  getUpsellLogs,
  createUpsellLog,
  deleteUpsellLog,
  getUpsellOrderComments,
  createUpsellOrderComment,
  createUpsellOrderHistory,
  deleteUpsellOrderComment,
  getUpsellOrders,
  getUpsellOrder,
  createUpsellOrder,
  updateUpsellOrder,
  deleteUpsellOrder,
  generateUpsellInvoice,
  sendBillingSummary,
  checkInvoiceStatus,
};
