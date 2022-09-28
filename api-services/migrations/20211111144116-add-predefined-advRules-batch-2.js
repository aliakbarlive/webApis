'use strict';

const UNPROFITABLE_KEYWORDS_CONSERVATIVE =
  'Unprofitable KWs 100-999 ACoS [conservative]';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('advRules', [
      {
        name: UNPROFITABLE_KEYWORDS_CONSERVATIVE,
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
            comparison: 'between',
            value: [1, 9.99],
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
          value: { type: 'percentage', value: 40 },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advRules', {
      name: UNPROFITABLE_KEYWORDS_CONSERVATIVE,
    });
  },
};
