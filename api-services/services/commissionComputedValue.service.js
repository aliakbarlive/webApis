const { CommissionComputedValue } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Add credential to account.
 * @param {object} data
 * @returns {<Credential>}
 */
const addCommissionComputedValue = async (data) => {
  const computedValue = await CommissionComputedValue.create(data);

  return computedValue;
};

module.exports = {
  addCommissionComputedValue,
};
