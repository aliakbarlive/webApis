const { Log } = require('../models');

/**
 * Save Logs
 * @param {object} payload : {
 *                              logType: "sampleType",
 *                              referenceId: 1,
 *                              name: "name of the log",
 *                              message: "additional message if needed",
 *                              status: "success" // ['success', 'error', 'warning', 'info', 'fatal']
 *                          }
 * @returns {Promise} Log
 */
const saveLog = async (payload) => {
  return await Log.create(payload);
};

module.exports = {
  saveLog,
};
