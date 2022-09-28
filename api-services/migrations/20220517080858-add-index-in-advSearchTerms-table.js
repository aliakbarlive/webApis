'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('advSearchTerms', {
      fields: [
        'advCampaignId',
        'advAdGroupId',
        'advTargetId',
        'advKeywordId',
        'target',
        'query',
      ],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('advSearchTerms', [
      'advCampaignId',
      'advAdGroupId',
      'advTargetId',
      'advKeywordId',
      'target',
      'query',
    ]);
  },
};
