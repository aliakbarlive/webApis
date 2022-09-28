'use strict';

const UNPROFITABLE_KEYWORDS_AGGRESSIVE =
  'Unprofitable KWs BE-50 ACoS [aggressive]';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('advRules', [
      {
        name: UNPROFITABLE_KEYWORDS_AGGRESSIVE,
        campaignType: 'sponsoredProducts',
        predefined: true,
        recordType: 'keywords',
        filters: JSON.stringify([
          {
            attribute: 'impressions',
            comparison: 'greaterThanOrEqualTo',
            value: 1000,
          },
          {
            attribute: 'acos',
            comparison: 'lessThanOrEqualTo',
            value: 0.5,
          },
          {
            attribute: 'profit',
            comparison: 'lessThanOrEqualTo',
            value: 0,
          },
          {
            value: 0.16,
            attribute: 'bid',
            comparison: 'greaterThanOrEqualTo',
          },
          {
            attribute: 'bid',
            comparison: 'greaterThan',
            value: 'cpc',
          },
          {
            attribute: 'bidUpdatedAtInDays',
            comparison: 'greaterThan',
            value: 4,
          },
        ]),
        advRuleActionId: 7,
        actionData: JSON.stringify({
          type: 'decreaseBy',
          value: { type: 'percentage', value: 20 },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advRules', {
      name: UNPROFITABLE_KEYWORDS_AGGRESSIVE,
    });
  },
};
