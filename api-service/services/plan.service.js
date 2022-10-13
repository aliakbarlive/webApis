const logger = require('../config/logger');
const asyncHandler = require('../middleware/async');
const { Plan } = require('../models');

/**
 * Get plan by name
 * @param {string} name
 * @returns {<Account>}
 */

const getPlan = async (name) => {
  const plan = await Plan.findOne({ where: { name } });

  return plan;
};

module.exports = { getPlan };
