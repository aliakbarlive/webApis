const {
  Termination,
  AgencyClient,
  Subscription,
  User,
  Cell,
} = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const zohoSubscription = require('../utils/zohoSubscription');
const {
  cancelSubscription,
  reactivateSubscription,
} = require('./subscription.service');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const sendRawEmail = require('../queues/ses/sendRawEmail');
const {
  getEmployeesFromCellToSquad,
  getEmployeesByType,
} = require('./agencyEmployee.service');

/**
 * Create Termination Request
 * @param {object} data
 * @returns {rows} terminations list
 */
const getTerminations = async (data) => {
  const { sort, pageSize: limit, pageOffset: offset, status } = data;
  let order = sort;

  if (sort[0].includes('Client')) {
    order = [
      [{ model: AgencyClient, as: 'agencyClient' }, 'client', sort[0][1]],
    ];
  } else if (sort[0].includes('Account Manager')) {
    order = [[{ model: User, as: 'accountManager' }, 'firstName', sort[0][1]]];
  }

  const out = await Termination.findAndCountAll({
    include: [
      {
        model: AgencyClient,
        as: 'agencyClient',
        attributes: ['client'],
      },
      {
        model: User,
        as: 'accountManager',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
      {
        model: User,
        as: 'seniorAccountManager',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
    ],
    where: { status },
    order,
    limit,
    offset,
  });

  return out;
};

const getTermination = async (id) => {
  const output = await Termination.findByPk(id, {
    include: [
      {
        model: AgencyClient,
        as: 'agencyClient',
        attributes: ['client'],
      },
      {
        model: User,
        as: 'accountManager',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
      {
        model: User,
        as: 'seniorAccountManager',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
    ],
  });

  return output;
};

/**
 * Create Termination Request
 * @param {object} data
 * @returns {<Termination>}
 */
const createTerminationReport = async (data) => {
  const out = await Termination.create(data);

  if (data.status === 'approved') {
    await cancelSubscriptionAtEnd(out.agencyClientId);
  }

  return { out };
};

/**
 * Update Termination Request
 * @param {object} data
 * @param {int} id
 * @returns {<Termination>}
 */
const updateTermination = async (data, id) => {
  const termination = await Termination.findByPk(id, {
    include: [
      {
        model: User,
        as: 'accountManager',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
      {
        model: User,
        as: 'seniorAccountManager',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
    ],
  });
  const { status: prevStatus } = termination;

  let tasks = null;
  if (prevStatus === 'pending' || prevStatus === 'cancelled') {
    if (data.status === 'approved') {
      tasks = await cancelSubscriptionAtEnd(termination);
    } else {
      tasks = { success: true, api: { message: '' } };
    }
  } else if (prevStatus === 'approved') {
    if (data.status === 'cancelled' || data.status === 'pending') {
      tasks = await reactivate(termination.agencyClientId);
    } else {
      tasks = { success: true, api: { message: '' } };
    }
  }

  if (tasks.success === true) {
    const out = await termination.update(data);
    return {
      success: true,
      out,
      tasks,
    };
  } else {
    return {
      success: false,
      tasks,
    };
  }
};

/**
 * Cancel Zoho subscription at end of billing cycle
 * @param {object} termination
 * @returns {object} promise
 */
const cancelSubscriptionAtEnd = async (termination) => {
  const agencyClient = await AgencyClient.findByPk(termination.agencyClientId, {
    include: [
      {
        model: User,
        as: 'defaultContact',
        attributes: ['firstName', 'lastName', 'email'],
      },
      {
        model: Cell,
        as: 'cells',
      },
    ],
  });

  const subscription = await Subscription.findOne({
    where: { accountId: agencyClient.accountId },
  });

  const cancelOk = await cancelSubscription(subscription.subscriptionId, true);
  const success_code = cancelOk.data ? cancelOk.data.code : cancelOk.code;

  //success_code == 0 || success_code == 100502 ? true : false;
  if (success_code === 0) {
    const out = await Promise.all([
      sendTerminationEmail('client', termination, agencyClient),
      sendTerminationEmail('agency', termination, agencyClient),
    ]);

    return { success: true, api: cancelOk, out };
  } else {
    return { success: false, api: cancelOk };
  }
};

/**
 * send client/agency an email termination notice
 * @param {string} userType - values: client/agency
 * @param {object} termination
 * @param {object} agencyClient
 * @returns {object} promise
 */
const sendTerminationEmail = async (userType, termination, agencyClient) => {
  const { client, defaultContact, cells } = agencyClient;
  const { terminationDate } = termination;
  const subject = `BetterSeller - Termination Notice ${
    userType === 'agency' ? `for ${client}` : ''
  }`;

  let filePath = path.join(
    __dirname,
    `../email-templates/termination-summary-${userType}-en.html`
  );

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let message = template
    .replace('{{client_name}}', client)
    .replace(
      '{{termination_date}}',
      moment(terminationDate).utc().format('YYYY-MM-DD')
    )
    .replace('{{client_name}}', client)
    .replace('{{email}}', defaultContact.email)
    .replace(
      '{{termination_date}}',
      moment(terminationDate).utc().format('YYYY-MM-DD')
    );

  let to =
    userType === 'client' ? defaultContact.email : await getAgencyEmails(cells);

  return await sendRawEmail.add(
    { email: to, subject, message },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

const getAgencyEmails = async (cells) => {
  const out = await Promise.all(
    cells.map(async (cell) => {
      const { cellId, type } = cell;
      return await getEmployeesFromCellToSquad(type, cellId);
    })
  );

  const opsPpc = [].concat.apply([], out);
  const writing = await getEmployeesByType('writing');
  const design = await getEmployeesByType('design');

  const opsPpcEmails = opsPpc.map((u) => {
    return u.email;
  });

  const writingEmails = writing.map((u) => {
    return u.email;
  });

  const designEmails = design.map((u) => {
    return u.email;
  });

  return [...opsPpcEmails, ...writingEmails, ...designEmails];
};

const reactivate = async (agencyClientId) => {
  const agencyClient = await AgencyClient.findByPk(agencyClientId, {
    include: [
      {
        model: User,
        as: 'defaultContact',
        attributes: ['firstName', 'lastName', 'email'],
      },
      {
        model: Cell,
        as: 'cells',
      },
    ],
  });

  const subscription = await Subscription.findOne({
    where: { accountId: agencyClient.accountId },
  });

  const reactivateOk = await reactivateSubscription(
    subscription.subscriptionId
  );
  const success_code = reactivateOk.data
    ? reactivateOk.data.code
    : reactivateOk.code;

  //success_code == 0 || success_code == 100502 ? true : false;
  if (success_code === 0) {
    const out = await sendReactivationEmail('agency', agencyClient);

    return { success: true, api: reactivateOk, out };
  } else {
    return { success: false, api: reactivateOk };
  }
};

/**
 * send client/agency an email reactivation notice
 * @param {string} userType - values: client/agency
 * @param {object} termination
 * @param {object} agencyClient
 * @returns {object} promise
 */
const sendReactivationEmail = async (userType, agencyClient) => {
  const { client, defaultContact, cells } = agencyClient;
  const subject = `BetterSeller - Reactivation Notice ${
    userType === 'agency' ? `for ${client}` : ''
  }`;

  let filePath = path.join(
    __dirname,
    `../email-templates/reactivation-summary-${userType}-en.html`
  );

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let message = template
    .replace('{{client_name}}', client)
    .replace('{{client_name}}', client)
    .replace('{{email}}', defaultContact.email);

  let to =
    userType === 'client' ? defaultContact.email : await getAgencyEmails(cells);

  return await sendRawEmail.add(
    { email: to, subject, message },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

const deleteTermination = async (terminationId) => {
  return await Termination.destroy({ where: { terminationId } });
};

module.exports = {
  getTerminations,
  getTermination,
  createTerminationReport,
  updateTermination,
  deleteTermination,
};
