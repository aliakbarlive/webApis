const { updateAgencyClient } = require('../services/agencyClient.service');
const emitter = require('./emitter');

emitter.on('clearNoCommission', async (agencyClientId) => {
  await updateAgencyClient(agencyClientId, {
    noCommission: false,
    noCommissionReason: null,
  });
});

emitter.on('addNoCommission', async (agencyClientId) => {
  await updateAgencyClient(agencyClientId, {
    noCommission: true,
    noCommissionReason: 'No commission added',
  });
});

module.exports = emitter;
