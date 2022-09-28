const aws = require('aws-sdk');

const config = {
  region: 'us-east-1',
};

const ses = new aws.SES(config);

const sendEmail = ({ email, subject, message }) => {
  return new Promise((resolve, reject) => {
    const recipients = Array.isArray(email) ? email : [email];

    const params = {
      Source: 'hello@betterseller.com',
      Destination: {
        ToAddresses: recipients,
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
          Data: subject,
        },
      },
    };

    ses.sendEmail(params, function (err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

module.exports = {
  sendEmail,
};
