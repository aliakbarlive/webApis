const Queue = require('bull');
const dotenv = require('dotenv');
const aws = require('aws-sdk');
const { Invite } = require('../../models');

dotenv.config({ path: 'config/config.env' });

const config = {
  region: 'us-east-1',
};

const ses = new aws.SES(config);

const queue = new Queue('SES - Send Raw Email', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

queue.process(async (job, done) => {
  try {
    const { email, subject, message, cc, bcc, source } = job.data;

    const recipients = Array.isArray(email) ? email : [email];
    const BccAddresses = [process.env.KEN_CC, process.env.DEV_CC];

    const params = {
      Source: source ?? 'BetterSeller <hello@betterseller.com>',
      Destination: {
        ToAddresses: recipients,
        CcAddresses: cc ?? [],
        BccAddresses: bcc ? [...BccAddresses, ...bcc] : BccAddresses,
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${subject} ${
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test'
              ? '(This is a sample email generated for testing purposes only)'
              : ''
          }`,
        },
      },
    };

    ses.sendEmail(params, function (error, data) {
      if (error) {
        done(new Error(error));
      } else {
        done(null, {
          messageId: data.MessageId,
          bcc: params.Destination.BccAddresses,
          subject,
        });
      }
    });
  } catch (error) {
    done(new Error(error));
  }
});

queue.on('completed', async (job, result) => {
  const { email, invite } = job.data;
  if (invite) {
    await updateInvite(invite, 'mail_sent');
    console.log(
      `Raw Email sent. Message ID: ${invite.inviteId}`,
      result.subject
    );
  } else {
    console.log(`Raw Email sent: ${email}`, result.subject);
  }
});

queue.on('failed', async (job, result) => {
  const { email, invite } = job.data;
  if (invite) {
    await updateInvite(invite, 'mail_not_sent');
  }
  console.log(`Sending email failed. ${email}`);
});

queue.on('error', function (err) {
  console.log('Error sending email.');
  console.log(err);
});

queue.on('active', function (job, err) {
  //console.log('Sending email active.');
});

const updateInvite = async (invite, status) => {
  const row = await Invite.findByPk(invite.inviteId);
  await row.update({
    inviteEmailExpire:
      status == 'mail_sent' ? Date.now() + 1 * 24 * 60 * 60 * 1000 : null, //expires in 1 day
    sentAt: Date.now(),
    status,
  });
};

module.exports = queue;
