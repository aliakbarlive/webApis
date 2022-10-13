'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advCampaignId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advAdGroupId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advCampaignNegativeKeywordId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advKeywordId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advNegativeKeywordId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advTargetId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advNegativeTargetId', 'recordType'],
          },
          { transaction }
        ),

        queryInterface.addIndex(
          'advChanges',
          {
            fields: ['advProductAdId', 'recordType'],
          },
          { transaction }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeIndex(
          'advChanges',
          ['advCampaignId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advAdGroupId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advCampaignNegativeKeywordId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advKeywordId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advNegativeKeywordId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advTargetId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advNegativeTargetId', 'recordType'],
          { transaction }
        ),

        queryInterface.removeIndex(
          'advChanges',
          ['advProductAdId', 'recordType'],
          { transaction }
        ),
      ]);
    });
  },
};
