const moment = require('moment');
const { Log } = require('../models');

exports.setLog = async (name, message, status) => {
  const transactionDate = moment().format();

  await Log.upsert({
    name,
    message,
    transactionDate,
    status,
  });
  console.log('Log Stored');
};

exports.getLog = async (name) => {
  return await Log.findOne({ where: { name } });
};
