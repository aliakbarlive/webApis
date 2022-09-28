const Queue = require('bull');
const dotenv = require('dotenv');
const aws = require('aws-sdk');

dotenv.config({ path: 'config/config.env' });

const config = {
  region: 'us-east-1',
};

const ses = new aws.SES(config);

const queue = new Queue('SES - Send Email', {
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
    const { email, bcc, template, templateData } = job.data;

    const params = {
      Source: 'BetterSeller <hello@betterseller.com>',
      Template: template,
      Destination: {
        ToAddresses: [email],
        BccAddresses: [bcc],
      },
      TemplateData: templateData,
    };

    ses.sendTemplatedEmail(params, function (error, data) {
      if (error) {
        done(new Error(error));
      } else {
        console.log(data);
        done(null, { messageId: data.MessageId });
      }
    });
  } catch (error) {
    done(new Error(error));
  }
});

queue.on('completed', async (job) => {
  const { messageId } = job.data;
  console.log(`Email sent. Message ID: ${messageId}`);
});

queue.on('failed', function (job, result) {
  console.log('Sending email failed.');
});

queue.on('error', function (err) {
  console.log('Error sending email.');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('Sending email active.');
});

module.exports = queue;
