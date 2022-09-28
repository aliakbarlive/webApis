const {
  ClientMigration,
  AgencyClient,
  User,
  Subscription,
} = require('../models');
const agencyClientService = require('./agencyClient.service');
const accountService = require('./account.service');
const commissionService = require('./commission.services');
const userService = require('./user.service');
const memberService = require('./member.service');
const zohoSubscription = require('../utils/zohoSubscription');
const sendRawEmail = require('../queues/ses/sendRawEmail');
const path = require('path');
const fs = require('fs');

const createAccount = async (clientName) => {
  const { accountId } = await accountService.createAccount(
    'agency',
    clientName
  );

  return accountId;
};

const createCommission = async (
  accountId,
  type,
  rate,
  marketplaceId,
  monthThreshold
) => {
  await commissionService.createCommission({
    accountId,
    type,
    rate,
    marketplaceId,
    monthThreshold,
    //commence, ???
  });
};

const createAgencyClient = async (cm) => {
  const { agencyClientId } = await AgencyClient.create({
    accountId: cm.accountId,
    client: cm.clientName,
    serviceAgreementLink: cm.serviceAgreement,
    status: 'registered',
    address: cm.address,
    siEmail: cm.email,
    website: cm.website,
    aboutUs: cm.aboutUs,
    overview: cm.overview,
    painPoints: cm.painPoints,
    goals: cm.goals,
    productCategories: cm.productCategories,
    amazonPageUrl: cm.amazonPage,
    asinsToOptimize: cm.asin,
    otherNotes: cm.notes,
  });

  return agencyClientId;
};

const createUser = async (firstName, lastName, email, password) => {
  const { userId } = await userService.createUser({
    roleId: 1,
    firstName,
    lastName,
    email,
    password,
    isEmailVerified: true,
  });

  return userId;
};

const addUserToAccount = async (userId, accountId) => {
  await memberService.addUserToAccount(userId, accountId, 8);
};

const addUserAsDefaultContact = async (userId, agencyClientId) => {
  await agencyClientService.addUserAsDefaultContact(userId, agencyClientId);
};

const generatePassword = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let randomStr = '';

  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomNum];
  }
  return randomStr;
};

const addClient = async (id) => {
  const cm = await ClientMigration.findByPk(id);

  if (!cm.accountId) {
    const accountId = await createAccount(cm.clientName);
    cm.accountId = accountId;
    cm.save();
  }

  if (!cm.agencyClientId) {
    const agencyClientId = await createAgencyClient(cm);
    cm.agencyClientId = agencyClientId;
    await cm.save();
  }

  if (cm.commissionRateUs) {
    const {
      accountId,
      commissionTypeUs,
      commissionRateUs,
      commissionMonthlyThresholdUs,
    } = cm;
    await createCommission(
      accountId,
      commissionTypeUs,
      commissionRateUs,
      'ATVPDKIKX0DER',
      commissionMonthlyThresholdUs
    );
  }

  if (cm.commissionRateCa) {
    const {
      accountId,
      commissionTypeCa,
      commissionRateCa,
      commissionMonthlyThresholdCa,
    } = cm;
    await createCommission(
      accountId,
      commissionTypeCa,
      commissionRateCa,
      'A2EUQ1WTGCTBG2',
      commissionMonthlyThresholdCa
    );
  }

  if (!cm.userId) {
    const { firstName, lastName, email } = cm;
    const password = generatePassword();
    const userId = await createUser(firstName, lastName, email, password);
    cm.password = password;
    cm.userId = userId;
    await cm.save();
  }

  await addUserToAccount(cm.userId, cm.accountId);
  await addUserAsDefaultContact(cm.userId, cm.agencyClientId);
};

const updateMigrationDetails = async (id, formData) => {
  const cm = await ClientMigration.findByPk(id);
  const {
    plan,
    price,
    description,
    commissionCa,
    commissionUs,
    client: clientName,
    email,
    serviceAgreementLink: serviceAgreement,
    address,
    website,
    aboutUs,
    overview,
    painPoints,
    goals,
    productCategories,
    amazonPageUrl: amazonPage,
    asinsToOptimize: asin,
    notes,
    baseline,
    grossUs,
    grossCa,
    amEmail,
    pmEmail,
  } = formData;

  const mResult = await cm.update({
    plan,
    price,
    description,
    commissionCa,
    commissionUs,
    clientName,
    email,
    serviceAgreement,
    address,
    website,
    aboutUs,
    overview,
    painPoints,
    goals,
    productCategories,
    amazonPage,
    asin,
    notes,
    baseline,
    grossUs,
    grossCa,
    amEmail,
    pmEmail,
  });

  const agencyClient = await AgencyClient.findByPk(cm.agencyClientId);

  const aResult = await agencyClient.update({
    address,
    client: clientName,
    website,
    aboutUs,
    overview,
    painPoints,
    goals,
    productCategories,
    amazonPageUrl: amazonPage,
    asinsToOptimize: asin,
    otherNotes: notes,
    serviceAgreementLink: serviceAgreement,
  });

  const defaultContact = await User.findByPk(cm.userId);
  await defaultContact.update({ email });

  return {
    migration: mResult,
    agencyClient: aResult,
  };
};

const sendTemporaryLoginEmail = async (cm) => {
  let filePath = path.join(__dirname, `../email-templates/temp-login-en.html`);

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let message = template
    .replace('{{email}}', cm.email)
    .replace('{{password}}', cm.password)
    .replace('{{link}}', process.env.SITE_URL);

  await sendRawEmail.add(
    {
      email: cm.email,
      subject: 'Your temporary login credentials',
      message,
    },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

const sendEmail = async (id, action = '') => {
  const cm = await ClientMigration.findByPk(id);

  let filePath = path.join(
    __dirname,
    `../email-templates/migration-summary-en.html`
  );

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );
  const subject =
    action === 'resend'
      ? `URGENT: Seller Interactive Invoice - ${cm.clientName}`
      : `BetterSeller Agency Subscription - ${cm.clientName}`;

  let messageIncludePath = path.join(
    __dirname,
    `../email-templates/migration-summary-message-en.html`
  );
  let messageTemplate = fs.readFileSync(
    messageIncludePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let msgBody =
    action === 'resend'
      ? messageTemplate.replace(
          '{{body}}',
          `Hi ${cm.clientName},<br /><br />As mentioned in our previous notice, we are in the process of migrating to our new client management system which incorporates a new invoicing process for improved accuracy and transparency.  Please use the check out button below to pay your invoice.  
<br /><br />We would really appreciate if you could pay the invoice as soon as possible.
      `
        )
      : '';

  let commissionIncludePath = path.join(
    __dirname,
    `../email-templates/migration-summary-commission-en.html`
  );
  let commissionTemplate = fs.readFileSync(
    commissionIncludePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let hasBaselineUs = cm.baseline ? `<br /> BASELINE: ${cm.baseline}` : '';
  let commissionableUs = cm.baseline
    ? parseFloat(cm.grossUs) - parseFloat(cm.baseline)
    : cm.grossUs;
  let commissionUs = cm.commissionUs
    ? commissionTemplate
        .replace('{{commission}}', 'Ongoing Sales Commission .COM')
        .replace(
          '{{commission_description}}',
          parseFloat(cm.commissionUs) === 0
            ? ''
            : `SEPT GROSS SALES: $${
                cm.grossUs
              } ${hasBaselineUs} <br /> COMMISSIONABLE: $${parseFloat(
                commissionableUs
              ).toFixed(2)} @ ${parseFloat(cm.commissionRateUs) * 100}%`
        )
        .replace('{{commission_price}}', parseFloat(cm.commissionUs).toFixed(2))
    : '';

  let hasBaselineCa = cm.baseline ? `<br /> BASELINE: ${cm.baseline}` : '';
  let commissionableCa = cm.baseline
    ? parseFloat(cm.grossCa) - parseFloat(cm.baseline)
    : cm.grossCa;
  let commissionCa = cm.commissionCa
    ? commissionTemplate
        .replace('{{commission}}', 'Ongoing Sales Commission .CA')
        .replace(
          '{{commission_description}}',
          parseFloat(cm.commissionCa) === 0
            ? ''
            : `SEPT GROSS SALES: $${
                cm.grossCa
              } ${hasBaselineCa} <br /> COMMISSIONABLE: $${parseFloat(
                commissionableCa
              ).toFixed(2)} @ ${parseFloat(cm.commissionRateCa) * 100}%`
        )
        .replace('{{commission_price}}', parseFloat(cm.commissionCa).toFixed(2))
    : '';

  let commissionCaTotal = cm.commissionCa ? parseFloat(cm.commissionCa) : 0;
  let commissionUsTotal = cm.commissionUs ? parseFloat(cm.commissionUs) : 0;
  let subTotal = parseFloat(cm.price) + commissionCaTotal + commissionUsTotal;
  let message = template
    .replace('{{plan}}', 'Agency Subscription')
    .replace('{{plan_description}}', cm.description)
    .replace('{{price}}', parseFloat(cm.price).toFixed(2))
    .replace('{{message}}', msgBody)
    .replace('{{commissionUs}}', commissionUs)
    .replace('{{commissionCa}}', commissionCa)
    .replace('{{subtotal_price}}', parseFloat(subTotal).toFixed(2))
    .replace('{{siteurl}}', process.env.SITE_URL)
    .replace('{{accountId}}', cm.accountId);

  let cc = [];
  if (cm.pmEmail) {
    cc.push(cm.pmEmail);
  }

  if (cm.amEmail) {
    cc.push(cm.amEmail);
  }

  const bcc = [process.env.SALES_ADMIN_CC];

  await sendRawEmail.add(
    { email: cm.email, subject, message, cc, bcc },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

const getZohoUrl = async (cm) => {
  if (cm?.status !== 'done') {
    return null;
  }

  let plan = {
    plan_code: cm.plan,
    plan_description: cm.description,
    price: cm.price,
    quantity: 1,
  };

  let hasBaselineCa = cm.baseline ? `\n BASELINE: $${cm.baseline}` : '';
  let commissionableCa = cm.baseline
    ? parseFloat(cm.grossCa) - parseFloat(cm.baseline)
    : cm.grossCa;
  let commissionCa = cm.commissionCa
    ? {
        name: 'Ongoing Sales Commission .CA',
        type: 'one_time',
        price: cm.commissionCa,
        quantity: 1,
        addon_code: 'ongoing-sales-commission-ca',
        addon_description:
          parseFloat(cm.commissionCa) === 0
            ? ''
            : `SEPT GROSS SALES: $${
                cm.grossCa
              } ${hasBaselineCa} \n COMMISSIONABLE: $${parseFloat(
                commissionableCa
              ).toFixed(2)} @ ${parseFloat(cm.commissionRateCa) * 100}%`,
      }
    : null;

  let hasBaselineUs = cm.baseline ? `\n BASELINE: $${cm.baseline}` : '';
  let commissionableUs = cm.baseline
    ? parseFloat(cm.grossUs) - parseFloat(cm.baseline)
    : cm.grossUs;
  let commissionUs = cm.commissionUs
    ? {
        name: 'Ongoing Sales Commission .COM',
        type: 'one_time',
        price: cm.commissionUs,
        quantity: 1,
        addon_code: 'ongoing-sales-commission',
        addon_description:
          parseFloat(cm.commissionUs) === 0
            ? ''
            : `SEPT GROSS SALES: $${
                cm.grossUs
              } ${hasBaselineUs} \n COMMISSIONABLE: $${parseFloat(
                commissionableUs
              ).toFixed(2)} @ ${parseFloat(cm.commissionRateUs) * 100}%`,
      }
    : null;

  let addons = [];
  if (commissionUs) {
    addons.push(commissionUs);
  }
  if (commissionCa) {
    addons.push(commissionCa);
  }

  let payload = {
    customer_id: cm.zohoId,
    plan,
    reference_id: cm.accountId,
    redirect_url: `${process.env.SITE_URL}/subscription/confirmation`,
    addons, // commissions
  };

  try {
    const subscriptionResponse = await zohoSubscription.callAPI({
      method: 'POST',
      operation: 'hostedpages/newsubscription',
      body: payload,
    });

    if (subscriptionResponse.data.code !== 0) {
      throw new ErrorResponse(
        'Failed creating hosted page for new subscription',
        400,
        subscriptionResponse
      );
    }

    return subscriptionResponse.data.hostedpage.url;
  } catch (err) {
    console.log(err);
    return 'invalid';
    //
    // throw err;
  }
};

const getByAccountId = async (accountId) => {
  const client = await ClientMigration.findOne({
    where: { accountId },
  });
  return client;
};

const createOfflineSubscription = async (id) => {
  const cm = await ClientMigration.findByPk(id);

  let hasBaselineCa = cm.baseline ? `\n BASELINE: $${cm.baseline}` : '';
  let commissionableCa = cm.baseline
    ? parseFloat(cm.grossCa) - parseFloat(cm.baseline)
    : cm.grossCa;
  let commissionCa = cm.commissionCa
    ? {
        name: 'Ongoing Sales Commission .CA',
        type: 'one_time',
        price: cm.commissionCa,
        quantity: 1,
        addon_code: 'ongoing-sales-commission-ca',
        addon_description:
          parseFloat(cm.commissionCa) === 0
            ? ''
            : `SEPT GROSS SALES: $${
                cm.grossCa
              } ${hasBaselineCa} \n COMMISSIONABLE: $${parseFloat(
                commissionableCa
              ).toFixed(2)} @ ${parseFloat(cm.commissionRateCa) * 100}%`,
      }
    : null;

  let hasBaselineUs = cm.baseline ? `\n BASELINE: $${cm.baseline}` : '';
  let commissionableUs = cm.baseline
    ? parseFloat(cm.grossUs) - parseFloat(cm.baseline)
    : cm.grossUs;
  let commissionUs = cm.commissionUs
    ? {
        name: 'Ongoing Sales Commission .COM',
        type: 'one_time',
        price: cm.commissionUs,
        quantity: 1,
        addon_code: 'ongoing-sales-commission',
        addon_description:
          parseFloat(cm.commissionUs) === 0
            ? ''
            : `SEPT GROSS SALES: $${
                cm.grossUs
              } ${hasBaselineUs} \n COMMISSIONABLE: $${parseFloat(
                commissionableUs
              ).toFixed(2)} @ ${parseFloat(cm.commissionRateUs) * 100}%`,
      }
    : null;

  let addons = [];
  if (commissionUs) {
    addons.push(commissionUs);
  }
  if (commissionCa) {
    addons.push(commissionCa);
  }

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: 'subscriptions',
    body: {
      customer_id: cm.zohoId,
      payment_terms: process.env.ZOHO_PAYMENT_TERMS,
      payment_terms_label: process.env.ZOHO_PAYMENT_TERMS_LABEL,
      plan: {
        plan_code: cm.plan,
        plan_description: cm.description,
        price: cm.price,
        quantity: 1,
      },
      addons,
      custom_fields: [],
      reference_id: cm.accountId,
      auto_collect: false,
    },
  });

  const { data } = output;

  if (data && data.code == 0) {
    let subscription = output.data.subscription;

    // * Insert new subscription to database
    await Subscription.create({
      accountId: cm.accountId,
      subscriptionId: subscription.subscription_id,
      status: subscription.status,
      activatedAt: subscription.activated_at,
      isOffline: true,
      data: subscription,
    });

    await AgencyClient.update(
      { status: 'subscribed' },
      {
        where: { accountId: cm.accountId },
      }
    );

    await sendTemporaryLoginEmail(cm);

    return data;
  } else {
    throw output;
  }
};

module.exports = {
  addClient,
  sendEmail,
  getZohoUrl,
  getByAccountId,
  updateMigrationDetails,
  createOfflineSubscription,
  sendTemporaryLoginEmail,
};
