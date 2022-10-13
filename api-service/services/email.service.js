const sendEmail = require('../queues/ses/sendEmail');
const sendRawEmailQueue = require('../queues/ses/sendRawEmail');
const path = require('path');
const fs = require('fs');

/**
 * Send email
 * @param {String} email
 * @param {String} body
 */
const sendVerificationEmail = async (email, verifyEmailToken) => {
  await sendEmail.add(
    {
      email,
      template: 'emailVerification-20210507063008',
      templateData: JSON.stringify({
        verifyEmailToken,
      }),
    },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

/**
 * Send email to higher ups after creating a credit note request
 */
const sendEmailToHigherUps = async (email, subject, message) => {
  await sendRawEmailQueue.add(
    { email, subject, message },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

const sendReauthEmail = async (data) => {
  let filePath = path.join(__dirname, `../email-templates/reauth-en.html`);

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let spApi = data.spApi
    ? `<span style="margin-left: 35px"><img src="https://cdnjs.cloudflare.com/ajax/libs/mocha/1.0.2/package/images/ok.png" width="20" height="20" alt="Authorized" /></span>`
    : `<span style="color: #f00;margin-left: 30px;background-color: #fee2e2;padding: 3px 10px;border-radius: 6px;font-size: 14px;">Not Authorized</span>`;

  let advApi = data.advApi
    ? `<span style="margin-left: 20px"><img src="https://cdnjs.cloudflare.com/ajax/libs/mocha/1.0.2/package/images/ok.png" width="20" height="20" alt="Authorized" /></span>`
    : `<span style="color: #f00;margin-left: 18px;background-color: #fee2e2;padding: 3px 10px;border-radius: 6px;font-size: 14px;">Not Authorized</span>`;

  let message = template
    .replace('{{name}}', data.name)
    .replace('{{spApi}}', spApi)
    .replace('{{advApi}}', advApi)
    .replace('{{loginUrl}}', process.env.SITE_URL);

  //

  await sendRawEmailQueue.add(
    {
      email: data.email,
      subject: `Seller Interactive - Client Dashboard (BetterSeller): ${data.name}`,
      message,
      cc: ['api-auth@sellerinteractive.com'],
    },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );

  //console.log(out);
};

const sendClientContactDetails = async (
  email,
  subject,
  firstName,
  client,
  password
) => {
  let filePath = path.join(
    __dirname,
    `../email-templates/new-default-contact.html`
  );

  let template = fs.readFileSync(
    filePath,
    { encoding: 'utf-8' },
    function (err) {
      console.log(err);
    }
  );

  let message = template
    .replace('{{firstName}}', firstName)
    .replace('{{client}}', client)
    .replace('{{email}}', email)
    .replace('{{password}}', password);

  await sendRawEmailQueue.add(
    { email, subject, message },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

module.exports = {
  sendVerificationEmail,
  sendEmailToHigherUps,
  sendReauthEmail,
  sendClientContactDetails,
};
