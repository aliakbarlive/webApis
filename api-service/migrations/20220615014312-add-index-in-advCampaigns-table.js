'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('advCampaigns', {
      fields: ['advProfileId', 'campaignType'],
    });

    await queryInterface.addIndex('advCampaigns', {
      fields: ['advProfileId', 'campaignType', 'advCampaignId'],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('advCampaigns', [
      'advProfileId',
      'campaignType',
    ]);

    await queryInterface.removeIndex('advCampaigns', [
      'advProfileId',
      'campaignType',
      'advCampaignId',
    ]);
  },
};
