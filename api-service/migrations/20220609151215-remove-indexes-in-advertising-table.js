'use strict';

const indexes = [
  { table: 'advCampaigns', fields: ['advCampaignId', 'lastUpdatedDate'] },
  { table: 'advAdGroups', fields: ['advAdGroupId', 'lastUpdatedDate'] },
  { table: 'advKeywords', fields: ['advKeywordId', 'lastUpdatedDate', 'bid'] },
  { table: 'advTargets', fields: ['advTargetId', 'lastUpdatedDate', 'bid'] },
  { table: 'advProductAds', fields: ['advProductAdId', 'lastUpdatedDate'] },
  {
    table: 'advNegativeTargets',
    fields: ['advNegativeTargetId', 'lastUpdatedDate'],
  },
  {
    table: 'advNegativeKeywords',
    fields: ['advNegativeKeywordId', 'lastUpdatedDate'],
  },
  {
    table: 'advCampaignNegativeKeywords',
    fields: ['advCampaignNegativeKeywordId', 'lastUpdatedDate'],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all(
        indexes.map(({ table, fields }) => {
          return queryInterface.removeIndex(table, fields, { transaction });
        })
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all(
        indexes.map(({ table, fields }) => {
          return queryInterface.addIndex(table, { fields }, { transaction });
        })
      );
    });
  },
};
