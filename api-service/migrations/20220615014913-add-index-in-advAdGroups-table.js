'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('advAdGroups', {
      fields: ['advCampaignId'],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('advAdGroups', ['advCampaignId']);
  },
};
