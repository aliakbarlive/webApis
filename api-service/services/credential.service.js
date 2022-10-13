const { Credential } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Add credential to account.
 * @param {uuid} accountId
 * @param {string} service
 * @param {object} data
 * @returns {<Credential>}
 */
const addCredentialToAccount = async (accountId, service, data) => {
  const { oAuthCode, refreshToken, accessToken, accessTokenExpire } = data;

  const credential = await Credential.create({
    accountId,
    service,
    oAuthCode,
    refreshToken,
    accessToken,
    accessTokenExpire,
  });

  return credential;
};

module.exports = {
  addCredentialToAccount,
};
