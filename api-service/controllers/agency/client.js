const {
  User,
  AgencyClient,
  Subscription,
  Invite,
  Account,
  Credential,
  ClientMigration,
  SubscriptionCycleDate,
  Termination,
  Squad,
  Pod,
  Role,
  Cell,
  CellClient,
  sequelize,
} = require('@models');
const { Op, col, where } = require('sequelize');
const ErrorResponse = require('@utils/errorResponse');
const asyncHandler = require('@middleware/async');
const inviteService = require('@services/invite.service');
const accountService = require('@services/account.service');
const userService = require('@services/user.service');
const roleService = require('@services/role.service');
const agencyClientService = require('@services/agencyClient.service');
const commissionService = require('@services/commission.services');
const accountEmployeeService = require('@services/accountEmployee.service');
const clientMigrationService = require('@services/clientMigrationService');
const subscriptionService = require('@services/subscription.service');
const invoiceService = require('@services/invoice.service');
const memberService = require('@services/member.service');
const { sendClientContactDetails } = require('@services/email.service');

const generator = require('generate-password');
const fs = require('fs');
const csv = require('fast-csv');
const moment = require('moment');
const { pick, keys } = require('lodash');
const {
  getZohoCustomers,
  getZohoCustomer,
} = require('@services/client.service');
const { clients } = require('@queues/ses/sendRawEmail');
const {
  addAgencyClientLog,
  listAgencyClientLogs,
  updateNoCommission,
} = require('../../services/agencyClient.service');

// * @desc     Get all clients
// * @route    GET /api/v1/agency/client
// * @access   Private
exports.getClients = asyncHandler(async (req, res, next) => {
  const { sort, page, pageSize, pageOffset, search, status, migrateOnly } =
    req.query;

  const { count, rows } = await agencyClientService.getClients(req.user, {
    sort,
    page,
    pageSize,
    pageOffset,
    search,
    status,
    migrateOnly,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
      search,
      status,
      migrateOnly,
    },
  });
});

// *@desc     Get zoho clients - filtered
// * @route    GET /api/v1/agency/client/zoho
// * @access   Private
exports.getZohoCustomers = asyncHandler(async (req, res, next) => {
  const { query } = req;

  const output = await getZohoCustomers(query);
  res.status(200).json({
    success: true,
    output,
  });
});

// *@desc     Get client by id
// * @route    GET /api/v1/agency/client/:id
// * @access   Private
exports.getClient = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;

  const client = await agencyClientService.getClient(id);

  // * Check if zohoId is already set on the client
  // * this is temporary fix until the onboarding process saves the zohoId on agencyClients table
  if (
    client.status === 'subscribed' &&
    (client.zohoId === null || client.zohoId === '')
  ) {
    const cm = await clientMigrationService.getByAccountId(client.accountId);

    // * If exists on clientMigration table, then copy the zohoId
    // * and store it on agencyClients table
    if (cm && cm.zohoId !== null) {
      await agencyClientService.addZohoId(cm.zohoId, client.agencyClientId);
    } else {
      // * Get customer id from using zoho subscription
      const subscriptionId = client.account?.subscription?.subscriptionId;
      if (subscriptionId) {
        const { customer_id } = await subscriptionService.getSubscription(
          subscriptionId
        );
        if (customer_id) {
          await agencyClientService.addZohoId(
            customer_id,
            client.agencyClientId
          );
        }
      }
    }
  }

  res.status(200).json({
    success: true,
    data: client,
  });
});

exports.getClientByAccountId = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;

  const client = await agencyClientService.getClientByAccountId(id);
  res.status(200).json({
    success: true,
    data: client,
  });
});

// *@desc     Get zoho client by id
// * @route    GET /api/v1/agency/client/zoho/:id
// * @access   Private
exports.getZohoCustomer = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await getZohoCustomer(id);
  res.status(200).json({
    success: true,
    output,
  });
});

// * @desc     Add new client + create default contact user + add commission
// * @route    POST /api/v1/agency/client
// *@access   Private
exports.addClient = asyncHandler(async (req, res, next) => {
  const {
    client,
    serviceAgreementLink,
    aboutUs,
    addons,
    address,
    phone,
    amazonPageUrl,
    asinsToOptimize,
    categoryList,
    asinList,
    billing_cycles,
    convert_retainer_cycle,
    currency_code,
    email,
    goals,
    otherNotes,
    overview,
    painPoints,
    name,
    plan_code,
    plan_description,
    price,
    pricebook_id,
    productCategories,
    retainer_after_convert,
    siEmail,
    website,
    status,
    type,
    rate,
    marketplaceId,
    defaultMarketplace,
    monthThreshold,
    preContractAvgBenchmark,
    commence,
    rules,
    zohoId,
    managedAsins,
    salesPerson,
    contractSigned,
    contactName,
    contactName2,
    primaryEmail,
    secondaryEmail,
    thirdEmail,
    service,
    accountStatus,
    noCommission,
    noCommissionReason,
  } = req.body;

  // * Check if email already exists as a user
  const user = await userService.getUser({ email });

  if (user) {
    throw new ErrorResponse(`${email} is already registered`, 409);
  }

  const addonsResponse = await Promise.all(
    addons.map(async (addon) => {
      return await subscriptionService.addAddon(addon);
    })
  );

  // * Check if every add-on has been added(0) or already exists(100502)
  if (!addonsResponse.every((code) => code === 0 || code === 100502)) {
    throw new ErrorResponse('Failed to create add-ons.', 400, addonsResponse);
  }

  await sequelize.transaction(async (t1) => {
    const sp = salesPerson ? await userService.getUserById(salesPerson) : null;

    // * Create agency client
    const agencyClient = await AgencyClient.create({
      client,
      serviceAgreementLink,
      status,
      address,
      phone,
      siEmail,
      contractSigned,
      contactName,
      contactName2,
      primaryEmail,
      secondaryEmail,
      thirdEmail,
      service,
      accountStatus,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      categoryList,
      asinList,
      otherNotes,
      draftMarketplace: defaultMarketplace,
      hostedpageDetails: {
        customer_name: client,
        email,
        name,
        currency_code,
        plan_code,
        plan_description,
        price,
        pricebook_id,
        convert_retainer_cycle,
        retainer_after_convert,
        billing_cycles,
        addons,
        customer_id: zohoId,
        salesperson_name: sp ? `${sp.firstName} ${sp.lastName}` : '',
        salesperson_id: sp ? salesPerson : null,
      },
      draftCommission: noCommission
        ? null
        : {
            type,
            rate,
            marketplaceId,
            monthThreshold,
            preContractAvgBenchmark,
            commence,
            rules: type === 'tiered' ? rules : null,
            managedAsins,
          },
      zohoId,
      noCommission,
      noCommissionReason: noCommission ? noCommissionReason : null,
    });

    if (status === 'created') {
      // * Create account with agency plan and account name of client
      const { accountId } = await accountService.createAccount(
        'agency',
        client
      );

      // * Get role details
      const userRole = await roleService.getRole('user', 'application');
      const accountRole = await roleService.getRole('owner', 'account');

      // * Create invite
      await inviteService.createInvite(
        email,
        userRole.roleId,
        accountId,
        accountRole.roleId
      );

      // * Add commission
      if (!noCommission) {
        await commissionService.createCommission({
          accountId,
          type,
          rate,
          marketplaceId,
          monthThreshold,
          managedAsins,
          commence,
        });
      }

      // * Update agency client with hosted page detail reference ID
      agencyClient.set({
        'hostedpageDetails.reference_id': accountId,
      });

      // * Update agency client status
      await agencyClient.update({
        accountId,
        status: 'invited',
        draftCommission: null,
      });
      await agencyClient.save();
    }

    res.status(200).json({
      success: true,
      agencyClient,
      // invite,
      addonsResponse,
    });
  });
});

// @desc     update pending client by id
// @route    PUT /api/v1/agency/client/:id
// @access   Private
exports.updateClient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    aboutUs,
    addons,
    serviceAgreementLink,
    address,
    phone,
    amazonPageUrl,
    asinsToOptimize,
    categoryList,
    asinList,
    billing_cycles,
    client,
    convert_retainer_cycle,
    currency_code,
    email,
    goals,
    otherNotes,
    overview,
    painPoints,
    name,
    plan_code,
    plan_description,
    price,
    pricebook_id,
    productCategories,
    retainer_after_convert,
    siEmail,
    website,
    status,
    reference_id,
    type,
    rate,
    marketplaceId,
    monthThreshold,
    preContractAvgBenchmark,
    commence,
    rules,
    zohoId,
    managedAsins,
    salesPerson,
    contractSigned,
    contactName,
    contactName2,
    primaryEmail,
    secondaryEmail,
    thirdEmail,
    service,
    accountStatus,
    noCommission,
    noCommissionReason,
  } = req.body;

  const agencyClient = await AgencyClient.findByPk(id);

  const addonsResponse = await Promise.all(
    addons.map(async (addon) => {
      return subscriptionService.addAddon(addon);
    })
  );

  // * Check if every add-on has been added(0) or already exists(100502)
  if (!addonsResponse.every((code) => code === 0 || code === 100502)) {
    throw new ErrorResponse('Failed to create add-ons.', 400, addonsResponse);
  }
  await sequelize.transaction(async (t1) => {
    const sp = salesPerson ? await userService.getUserById(salesPerson) : null;

    // * Update agency client
    await agencyClient.update({
      client,
      serviceAgreementLink,
      address,
      phone,
      siEmail,
      contractSigned,
      contactName,
      contactName2,
      primaryEmail,
      secondaryEmail,
      thirdEmail,
      service,
      accountStatus,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      categoryList,
      asinList,
      otherNotes,
      hostedpageDetails: {
        customer_name: client,
        email,
        currency_code,
        name,
        plan_code,
        plan_description,
        price,
        pricebook_id,
        convert_retainer_cycle,
        retainer_after_convert,
        billing_cycles,
        addons,
        reference_id,
        customer_id: zohoId,
        salesperson_name: sp ? `${sp.firstName} ${sp.lastName}` : '',
        salesperson_id: sp ? salesPerson : null,
      },
      zohoId,
      noCommission,
      noCommissionReason: noCommission ? noCommissionReason : '',
    });

    // * Does not apply to draft and invited status
    if (status === 'created') {
      // * Create account with agency plan and account name of client
      const { accountId } = await accountService.createAccount(
        'agency',
        client
      );

      // * Get role details
      const userRole = await roleService.getRole('user', 'application');
      const accountRole = await roleService.getRole('owner', 'account');

      // * Create invite
      await inviteService.createInvite(
        email,
        userRole.roleId,
        accountId,
        accountRole.roleId
      );

      // * Add commission
      if (!noCommission) {
        await commissionService.createCommission({
          accountId,
          type,
          rate,
          marketplaceId,
          monthThreshold,
          preContractAvgBenchmark,
          commence,
          rules: type === 'tiered' ? rules : null,
          managedAsins,
        });
      }

      // * Update agency client with hosted page detail reference ID
      agencyClient.set({
        'hostedpageDetails.reference_id': accountId,
      });

      // * Update
      await agencyClient.update({
        accountId,
        status: 'invited',
        draftCommission: null,
      });
      await agencyClient.save();
    } else if (status == 'draft') {
      if (!noCommission) {
        await agencyClient.update({
          draftCommission: {
            type,
            rate,
            marketplaceId,
            monthThreshold,
            preContractAvgBenchmark,
            commence,
            rules: type === 'tiered' ? rules : null,
            managedAsins,
          },
        });
      }
    } else if (status == 'invited') {
      if (!noCommission) {
        await commissionService.updateCommissionViaAccountId({
          accountId: agencyClient.accountId,
          type,
          rate,
          marketplaceId,
          monthThreshold,
          preContractAvgBenchmark,
          commence,
          rules: type === 'tiered' ? rules : null,
          managedAsins,
        });
      }

      await inviteService.updateInvitedEmail(agencyClient.accountId, email);
    } else if (status == 'registered') {
      if (!noCommission) {
        await commissionService.updateCommissionViaAccountId({
          accountId: agencyClient.accountId,
          type,
          rate,
          marketplaceId,
          monthThreshold,
          preContractAvgBenchmark,
          commence,
          rules: type === 'tiered' ? rules : null,
          managedAsins,
        });
      }
    }

    res.status(200).json({
      success: true,
      agencyClient,
      // invite: invites[0],
      addonsResponse,
    });
  });
});

// @desc     update existing client by id
// @route    PATCH /api/v1/agency/client/:id
// @access   Private
exports.updateExistingClient = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    body: {
      client,
      serviceAgreementLink,
      address,
      phone,
      siEmail,
      contractSigned,
      contactName,
      contactName2,
      primaryEmail,
      secondaryEmail,
      thirdEmail,
      service,
      accountStatus,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      categoryList,
      asinList,
      otherNotes,
    },
  } = req;

  let payload = {
    client,
    serviceAgreementLink,
    address,
    phone,
    siEmail,
    contractSigned,
    contactName,
    contactName2,
    primaryEmail,
    secondaryEmail,
    thirdEmail,
    service,
    accountStatus,
    website,
    aboutUs,
    overview,
    painPoints,
    goals,
    productCategories,
    amazonPageUrl,
    asinsToOptimize,
    categoryList,
    asinList,
    otherNotes,
  };

  await sequelize.transaction(async (t1) => {
    const agencyClient = await AgencyClient.findByPk(id);
    await agencyClient.update(payload);

    const client = await agencyClientService.getClient(id);

    res.status(200).json({
      success: true,
      client,
    });
  });
});

exports.deleteClient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const data = await AgencyClient.destroy({ where: { agencyClientId: id } });

  res.status(200).json({
    success: data === 1 ? true : false,
  });
});

// @desc     Get Invites By Agency Client
// @route    GET /api/v1/agency/client/:agencyClientId/invite
// @access   Private
exports.getClientInvite = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;

  const invite = await Invite.findAll({
    include: {
      model: Account,
      attributes: [],
      include: {
        model: AgencyClient,
        attributes: [],
        where: {
          agencyClientId,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: invite,
  });
});

// @desc     Get employees assigned to an agency client account
// @route    GET /api/v1/agency/client/:agencyClientId/employees
// @access   Private
exports.getClientEmployees = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { page, pageSize, pageOffset, sortField, sortOrder } = req.query;

  // * Get agency client account
  const { accountId } = await agencyClientService.getClient(agencyClientId);

  // * Get account employees
  const { count, rows } = await accountEmployeeService.getEmployees(
    accountId,
    pageSize,
    pageOffset,
    sortField,
    sortOrder
  );

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
    },
  });
});

// @desc     Add employee to an agency client's account
// @route    POST /api/v1/agency/client/:agencyClientId/employees
// @access   Private
exports.addClientEmployee = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { userId } = req.body;

  // * Get agency client account
  const { accountId } = await agencyClientService.getClient(agencyClientId);

  // * Add employee to client agency's account
  const employee = await accountEmployeeService.addEmployee(accountId, userId);

  res.status(200).json({
    success: true,
    data: employee,
  });
});

// @desc     Remove employee from an agency client's account
// @route    DELETE /api/v1/agency/client/:agencyClientId/employees/:userId
// @access   Private
exports.deleteClientEmployee = asyncHandler(async (req, res, next) => {
  const { agencyClientId, userId } = req.params;

  // * Get agency client account
  const { accountId } = await agencyClientService.getClient(agencyClientId);

  // * Add employee to client agency's account
  const employee = await accountEmployeeService.deleteEmployee(
    accountId,
    userId
  );

  res.status(200).json({
    success: true,
    data: employee,
  });
});

// * Store the Cycle Date of the Agency Client
const storeCycleDate = async (client) => {
  const { agencyClientId, zohoId, SubscriptionCycleDates } = client;

  if (SubscriptionCycleDates.length === 0 && zohoId) {
    const { invoices } = await invoiceService.getInvoices(
      'Paid',
      '1',
      '1',
      'created_time',
      'none',
      zohoId,
      'A'
    );

    if (invoices && invoices.length > 0) {
      const { invoice_date: subscriptionStartDate } = invoices[0];

      const subscriptionValidUntilDate = moment(subscriptionStartDate)
        .add(1, 'months')
        .format('YYYY-MM-DD');

      const data = {
        agencyClientId,
        subscriptionStartDate,
        subscriptionValidUntilDate,
      };

      await SubscriptionCycleDate.create(data);
    }
  }
};

// * @desc     Process Cycle Dates of each client subscription
// * @route    GET /api/v1/agency/client/store-cycle-dates
// * @route    GET /api/v1/agency/client/:agencyClientId/store-cycle-dates
// * @access   Private
exports.storeCycleDates = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;

  let data = {};
  // * Single Client
  if (agencyClientId) {
    const agencyClient = await AgencyClient.findOne({
      attributes: ['agencyClientId', 'zohoId'],
      include: {
        attributes: ['subscriptionStartDate', 'subscriptionValidUntilDate'],
        model: SubscriptionCycleDate,
      },
      where: { agencyClientId },
    });
    data = agencyClient;
    await storeCycleDate(agencyClient);
  } else {
    // * All Clients that has no cycle date stored yet
    const agencyClients = await AgencyClient.findAll({
      attributes: ['agencyClientId', 'zohoId'],
      include: {
        attributes: ['subscriptionStartDate', 'subscriptionValidUntilDate'],
        model: SubscriptionCycleDate,
      },
    });
    data = agencyClients;
    agencyClients.map(async (client) => {
      await storeCycleDate(client);
    });
  }

  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Update Cycle Date of each client subscription
// * @route    POST /api/v1/agency/client/:agencyClientId/store-cycle-dates
// * @access   Private
exports.updateCycleDate = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { startDate, endDate } = req.body;

  await SubscriptionCycleDate.update(
    {
      subscriptionStartDate: startDate,
      subscriptionValidUntilDate: endDate,
    },
    {
      where: {
        agencyClientId,
      },
    }
  );

  res.status(200).json({
    success: true,
  });
});

// @desc     Get Invoice Emails
// @route    GET /api/v1/agency/client/:agencyClientId/invoice-emails
// @access   Private
exports.getInvoiceEmails = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;

  const data = await AgencyClient.findOne({
    attributes: ['invoiceEmails', 'zohoId'],
    where: {
      agencyClientId,
    },
  });

  const { zohoId } = data;

  const { invoiceEmails } = await agencyClientService.getInvoiceEmailsByZohoId(
    zohoId
  );

  let to_mail_ids = [];
  if (invoiceEmails !== null && invoiceEmails.length > 0) {
    to_mail_ids = invoiceEmails;
  }
  res.status(200).json({
    success: true,
    data,
    to_mail_ids,
  });
});

// @desc     Save Invoice Emails
// @route    POST /api/v1/agency/client/:agencyClientId/invoice-emails
// @access   Private
exports.saveInvoiceEmails = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const payload = {
    ...pick(req.body, keys(AgencyClient.rawAttributes)),
  };

  await AgencyClient.update(payload, {
    where: { agencyClientId },
  });

  res.status(200).json({
    success: true,
  });
});

// @desc     Get Cells
// @route    GET /api/v1/agency/client/:agencyClientId/cells
// @access   Private
exports.getCells = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;

  const agencyClient = await AgencyClient.findByPk(agencyClientId, {
    attributes: ['accountId'],
    include: {
      model: Cell,
      as: 'cells',
      attributes: ['cellId', 'name', 'type'],
      through: { attributes: [] },
    },
  });

  const cellsOperation = await Cell.findAll({
    attributes: ['cellId', 'name'],
    where: {
      type: 'operations',
    },
  });

  const cellsPpc = await Cell.findAll({
    attributes: ['cellId', 'name'],
    where: {
      type: 'ppc',
    },
  });

  res.status(200).json({
    success: true,
    agencyClient,
    options: {
      cellsOperation,
      cellsPpc,
    },
  });
});

// @desc     Get Cells
// @route    POST /api/v1/agency/client/:agencyClientId/cells
// @access   Private
exports.saveCells = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { type, cellId } = req.body;

  // Check if with exisiting record
  const agencyClient = await AgencyClient.findByPk(agencyClientId, {
    attributes: ['accountId'],
    include: {
      model: Cell,
      as: 'cells',
      attributes: ['cellId', 'name', 'type'],
      through: { attributes: [] },
      where: {
        type: type,
      },
      require: true,
    },
  });

  if (cellId == 0) {
    await CellClient.destroy({
      where: { agencyClientId, cellId: agencyClient.cells[0].cellId },
    });
  } else {
    if (agencyClient) {
      await CellClient.update(
        { cellId },
        { where: { agencyClientId, cellId: agencyClient.cells[0].cellId } }
      );
    } else {
      await CellClient.create({
        agencyClientId,
        cellId,
      });
    }
  }

  const client = await agencyClientService.getClient(agencyClientId);

  res.status(200).json({
    success: true,
    output: client,
  });
});

// @desc     Get Cells
// @route    POST /api/v1/agency/client/pods/:podId
// @access   Private
exports.getClientsByPodId = asyncHandler(async (req, res, next) => {
  const { podId } = req.params;
  const { isPpc: isPPC } = req.query;
  const isPpc = isPPC === 'true' ? true : false;

  const clients = await AgencyClient.findAll({
    attributes: ['accountId', 'client', 'zohoId'],
    include: {
      model: Cell,
      as: 'cells',
      attributes: ['cellId', 'name', 'isPpc', 'podId'],
      through: { attributes: [] },
      where: {
        podId,
        isPpc,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: clients,
  });
});

// @desc     Get Cells
// @route    POST /api/v1/agency/client/file
// @access   Private
exports.processCSVFile = asyncHandler(async (req, res, next) => {
  moment.tz.setDefault('America/Toronto');
  const temp = req.file;
  let success = false;
  let message = '';
  if (temp) {
    const { path, mimetype } = temp;

    if (
      mimetype === 'text/csv' ||
      mimetype === 'application/vnd.ms-excel' ||
      mimetype === 'text/x-csv' ||
      mimetype === 'text/plain'
    ) {
      success = true;
      const fd = fs.createReadStream(path);
      const dd = fd.pipe(csv.parse({ headers: true }));
      dd.on('error', (error) => console.error(error));
      dd.on('data', async (row) => {
        const {
          id,
          Inactive: inactive,
          'CONTRACT SIGNED (date)': contractSigned,
          'Brand Name': client,
          'Contact Name 1': contactName,
          'Contact Name 2': contactName2,
          'Phone Number ': phone,
          'Primary Email': primaryEmail,
          'Secondary Email': secondaryEmail,
          'Third Email': thirdEmail,
          'SERVICE (drop down)': service,
          'ACCOUNT STATUS (drop down)': accountStatus,
          'Product Category (drop down)': categories,
          'SI EMAIL (email)': siEmail,
          'Operations Manager': operationsManager,
          'Project Manager': projectManager,
          'Senior AM': seniorAccountManager,
          'Account Manager': accountManager,
          'Account Coordinator 1': accountCoordinator1,
          'Account Coordinator 2': accountCoordinator2,
          'Account Coordinator 3': accountCoordinator3,
          'PPC Lead': ppcLead,
          'PPC Specialist': ppcSpecialist,
          'Jr PPC Specialist': juniorPpcSpecialist,
        } = row;

        // get operation cell
        // 1. check if it has account manager
        // 2. check if account manager is the same as the senior am
        // 3. if not, use am and locate which cell it belong to
        // 4. if the same, check the account coordinator 1 and get the cell id
        // 5. if account manager is empty, check account coordinator 1 and get the cell id
        // 6. if ac1 is empty, check ac2 and get cell id
        // 6. if ac2 is empty, check ac3 and get cell id
        let operationCellEmployee = null;
        let ppcCellEmployee = null;
        let cellOrgObject = null;
        let cellPPCObject = null;
        if (accountManager !== '') {
          if (accountManager === seniorAccountManager) {
            if (accountCoordinator1 !== '') {
              operationCellEmployee = accountCoordinator1;
            } else if (accountCoordinator2 !== '') {
              operationCellEmployee = accountCoordinator2;
            } else if (accountCoordinator3 !== '') {
              operationCellEmployee = accountCoordinator3;
            }
          } else {
            operationCellEmployee = accountManager;
          }
        } else {
          if (accountCoordinator1 !== '') {
            operationCellEmployee = accountCoordinator1;
          } else if (accountCoordinator2 !== '') {
            operationCellEmployee = accountCoordinator2;
          } else if (accountCoordinator3 !== '') {
            operationCellEmployee = accountCoordinator3;
          }
        }
        if (operationCellEmployee) {
          const nameArr = operationCellEmployee.split(' ');
          const firstName = nameArr[0].trim();
          const lastName = nameArr.pop();

          const user = await userService.getUserByName(firstName, lastName);
          if (user) {
            if (user.Cells.length > 0) {
              const cell = user.Cells[0];
              const { cellId, name } = cell;

              cellOrgObject = {
                cellId,
                name,
                type: 'operations',
              };
            }
          }
        }

        // get ppc cell
        // 1. check if ppc specialist is not empty
        // 2. if not empty, get the cell id
        // 3. if empty, check the jr ppc specialist and get cell id
        // 4. if both are empty, skip the process of getting the cell id

        if (ppcSpecialist !== '') {
          ppcCellEmployee = ppcSpecialist;
        } else if (juniorPpcSpecialist !== '') {
          ppcCellEmployee = juniorPpcSpecialist;
        }
        if (ppcCellEmployee) {
          const nameArr = ppcCellEmployee.split(' ');
          const firstName = nameArr[0].trim();
          const lastName = nameArr.pop();
          const user = await userService.getUserByName(firstName, lastName);
          if (user) {
            if (user.Cells.length > 0) {
              const cell = user.Cells[0];
              const { cellId, name } = cell;

              cellPPCObject = {
                cellId,
                name,
                type: 'ppc',
              };
            }
          }
        }

        const catArr = categories.trim().split(',');
        let categoryList = '';
        if (catArr.length > 0) {
          categoryList = catArr.map((c) => {
            return { category: c };
          });
        }

        let payload = {
          siEmail,
          phone,
          contractSigned: contractSigned
            ? moment.utc(contractSigned).format('YYYY-MM-DD')
            : '',
          contactName,
          contactName2: contactName === contactName2 ? '' : contactName2,
          primaryEmail,
          secondaryEmail: primaryEmail === secondaryEmail ? '' : secondaryEmail,
          thirdEmail: secondaryEmail === thirdEmail ? '' : thirdEmail,
          service,
          accountStatus,
          categoryList,
        };

        if (siEmail) {
          // Get Client by SI Email
          // const agencyClient = await agencyClientService.getClientBySiEmail(
          //   siEmail
          // );
          const agencyClient = await agencyClientService.getClientByName(
            client
          );
          if (agencyClient && client) {
            await agencyClient.update(payload);

            const { agencyClientId, cells } = agencyClient;

            // Assign the cell to the agency client
            let hasOperationCell = false;
            let hasPPCCell = false;
            cells.length > 0 &&
              cells.map(async (cell) => {
                if (
                  cellOrgObject !== null &&
                  cell.type === cellOrgObject.type
                ) {
                  hasOperationCell = true;
                  if (cell.cellId !== cellOrgObject.cellId) {
                    await CellClient.update(
                      { cellId: cellOrgObject.cellId },
                      { where: { agencyClientId, cellId: cell.cellId } }
                    );
                  }
                } else if (cell.type === 'operations') {
                  // remove the assigned cell if the source has no cell
                  await CellClient.destroy({
                    where: { agencyClientId, cellId: cell.cellId },
                  });
                }

                if (
                  cellPPCObject !== null &&
                  cell.type === cellPPCObject.type
                ) {
                  hasPPCCell = true;
                  if (cell.cellId !== cellPPCObject.cellId) {
                    await CellClient.update(
                      { cellId: cellPPCObject.cellId },
                      { where: { agencyClientId, cellId: cell.cellId } }
                    );
                  }
                } else if (cell.type === 'ppc') {
                  // remove the assigned cell if the source has no cell
                  await CellClient.destroy({
                    where: { agencyClientId, cellId: cell.cellId },
                  });
                }
              });

            if (hasOperationCell === false && cellOrgObject !== null) {
              await CellClient.create({
                agencyClientId,
                cellId: cellOrgObject.cellId,
              });
            }

            if (hasPPCCell === false && cellPPCObject !== null) {
              await CellClient.create({
                agencyClientId,
                cellId: cellPPCObject.cellId,
              });
            }
          }
        }
      });
      dd.on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
    } else {
      message = 'Please upload the MASTER CLIENT SHEET CSV file';
    }
  }

  res.status(200).json({
    success,
    message,
  });
});

// @desc     Check existing emails
// @route    POST /api/v1/agency/client/check-contact-email
// @access   Private
exports.checkDefaultContactEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  let exists = false;
  let alreadyAssigned = false;
  // * Check if email already exists as a user
  const user = await userService.getUser({ email });

  if (user) {
    exists = true;
    const { userId } = user;
    const assigned = await AgencyClient.findOne({
      where: { defaultContactId: userId },
    });

    if (assigned) {
      alreadyAssigned = true;
    }
  }

  res.status(200).json({
    success: true,
    exists,
    alreadyAssigned,
    user,
  });
});

// @desc     Create Default Contact and assign to the AgencyClient
// @route    POST /api/v1/agency/client/:agencyClientId/create-default-contact
// @access   Private
exports.createNewDefaultContact = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const { agencyClientId } = req.params;

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const agencyClient = await agencyClientService.getClient(agencyClientId);

  const userRole = await roleService.getRole('user', 'application');

  // * Create user
  const user = await userService.createUser({
    roleId: userRole.roleId,
    firstName,
    lastName,
    email,
    password,
    isEmailVerified: true,
  });

  await sendClientContactDetails(
    email,
    'New Default Contact',
    firstName,
    agencyClient.client,
    password
  );

  agencyClient.defaultContactId = user.userId;

  // Add new contact as a member to the agency client
  await memberService.addUserToAccount(
    user.userId,
    agencyClient.accountId,
    userRole.roleId
  );

  await agencyClient.save();

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc     Assign Existing Contact
// @route    POST /api/v1/agency/client/:agencyClientId/assign-existing-contact
// @access   Private
exports.assignExistingContact = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const { agencyClientId } = req.params;
  const user = await userService.getUserById(userId);

  const agencyClient = await agencyClientService.getClient(agencyClientId);

  //Add new contact as a member to the agency client
  await memberService.addUserToAccount(
    user.userId,
    agencyClient.accountId,
    user.role.roleId
  );

  agencyClient.defaultContactId = user.userId;

  res.status(200).json({
    success: true,
  });
});

// @desc     Change Zoho Default Contact
// @route    POST /api/v1/agency/client/update-zoho-default-contact
// @access   Private
exports.updateZohoDefaultContact = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, zohoId } = req.body;

  let success = false;
  let data = null;
  let msg = '';
  if (firstName && lastName && email && zohoId) {
    const body = {
      display_name: `${firstName}`,
      first_name: firstName,
      last_name: lastName,
      email,
    };
    const client = await agencyClientService.updateZohoEmail(zohoId, body);
    const { code, message, customer } = client;
    if (code === 0) {
      success = true;
      data = customer;
    }
    msg = message;
  }

  res.status(200).json({
    success,
    msg,
    data,
  });
});

// @desc     List AgencyClientLogs
// @route    GET /api/v1/agency/client/:id/log
// @access   Private
exports.getAgencyClientLogs = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { pageOffset, pageSize } = req.query;

  const log = await listAgencyClientLogs(agencyClientId, {
    pageOffset,
    pageSize,
  });

  res.status(200).json({
    success: true,
    log,
  });
});

// @desc     Add AgencyClientLog
// @route    POST /api/v1/agency/client/:id/log
// @access   Private
exports.addAgencyClientLog = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { userId } = req.user;
  const { tags, message } = req.body;

  const log = await addAgencyClientLog({
    agencyClientId,
    tags,
    message,
    addedBy: userId,
  });

  res.status(200).json({
    success: true,
    log,
  });
});

exports.updateNoCommission = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { noCommission, noCommissionReason } = req.body;

  const output = await updateNoCommission(
    agencyClientId,
    noCommission,
    noCommissionReason
  );

  res.status(200).json({
    success: true,
    output,
  });
});
