'use strict';

const ZERO_SALES_SEARCH_TERMS = 'Zero Sale Search Terms';
const ZERO_SALES_KEYWORDS = 'Zero Sale Keywords';
const LOW_POTENTIAL_SEARCH_TERMS = 'Low Potential Search Terms';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const campaignType = 'sponsoredProducts';
    const rules = [
      {
        name: ZERO_SALES_SEARCH_TERMS,
        recordType: 'searchTerms',
        filters: [
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: '0',
          },
          {
            attribute: 'clicks',
            comparison: 'greaterThanOrEqualTo',
            value: '5',
          },
        ],
        advRuleActionId: 9,
        actionData: { level: 'adGroups', matchType: 'negativeExact' },
      },
      {
        name: ZERO_SALES_KEYWORDS,
        recordType: 'keywords',
        filters: [
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: '0',
          },
          {
            attribute: 'clicks',
            comparison: 'greaterThanOrEqualTo',
            value: '5',
          },
          {
            attribute: 'bid',
            comparison: 'greaterThanOrEqualTo',
            value: '0.16',
          },
        ],
        advRuleActionId: 7,
        actionData: { type: 'changeTo', value: 0.15 },
      },
      {
        name: LOW_POTENTIAL_SEARCH_TERMS,
        recordType: 'searchTerms',
        filters: [
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: '0',
          },
          {
            attribute: 'impressions',
            comparison: 'greaterThanOrEqualTo',
            value: '1000',
          },
          {
            attribute: 'ctr',
            comparison: 'lessThanOrEqualTo',
            value: '0.15',
          },
        ],
        advRuleActionId: 9,
        actionData: { level: 'adGroups', matchType: 'negativeExact' },
      },
    ];

    await queryInterface.bulkInsert(
      'advRules',
      rules.map((rule) => {
        return {
          ...rule,
          campaignType,
          predefined: true,
          filters: JSON.stringify(rule.filters),
          actionData: JSON.stringify(rule.actionData),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advRules', {
      name: {
        [Sequelize.Op.in]: [
          ZERO_SALES_KEYWORDS,
          ZERO_SALES_SEARCH_TERMS,
          LOW_POTENTIAL_SEARCH_TERMS,
        ],
      },
    });
  },
};
