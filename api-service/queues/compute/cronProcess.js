'use strict';
const dotenv = require('dotenv');
const {
  computeMonthlyCommission,
} = require('../../services/commission.services');
dotenv.config({ path: 'config/config.env' });

const cronProcess = async (job = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { accountId, invoiceDate } = job.data;

      await computeMonthlyCommission({
        accountId,
        invoiceDate,
      });

      return resolve({
        success: true,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = cronProcess;
