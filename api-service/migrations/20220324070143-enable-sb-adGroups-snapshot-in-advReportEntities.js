'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'advReportEntities',
      {
        hasSnapshot: true,
      },
      { campaignType: 'sponsoredBrands', recordType: 'adGroups' }
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
