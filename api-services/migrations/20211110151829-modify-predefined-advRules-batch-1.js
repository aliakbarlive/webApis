'use strict';

const ZERO_SALES_SEARCH_TERMS = 'Zero Sale Search Terms';
const LOW_POTENTIAL_SEARCH_TERMS = 'Low Potential Search Terms';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'advRules',
      {
        filters: JSON.stringify([
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: 0,
          },
          {
            attribute: 'clicks',
            comparison: 'greaterThanOrEqualTo',
            value: 5,
          },
          {
            attribute: 'convertedAsNegativeKeyword',
            comparison: 'equalTo',
            value: false,
          },
        ]),
      },
      {
        name: ZERO_SALES_SEARCH_TERMS,
      }
    );

    await queryInterface.bulkUpdate(
      'advRules',
      {
        filters: JSON.stringify([
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: 0,
          },
          {
            attribute: 'impressions',
            comparison: 'greaterThanOrEqualTo',
            value: 1000,
          },
          {
            attribute: 'ctr',
            comparison: 'lessThanOrEqualTo',
            value: 0.15,
          },
          {
            attribute: 'convertedAsNegativeKeyword',
            comparison: 'equalTo',
            value: false,
          },
        ]),
      },
      {
        name: LOW_POTENTIAL_SEARCH_TERMS,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'advRules',
      {
        filters: JSON.stringify([
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: 0,
          },
          {
            attribute: 'clicks',
            comparison: 'greaterThanOrEqualTo',
            value: 5,
          },
        ]),
      },
      {
        name: ZERO_SALES_SEARCH_TERMS,
      }
    );

    await queryInterface.bulkUpdate(
      'advRules',
      {
        filters: JSON.stringify([
          {
            attribute: 'attributedUnitsOrdered30d',
            comparison: 'equalTo',
            value: 0,
          },
          {
            attribute: 'impressions',
            comparison: 'greaterThanOrEqualTo',
            value: 1000,
          },
          {
            attribute: 'ctr',
            comparison: 'lessThanOrEqualTo',
            value: 0.15,
          },
        ]),
      },
      {
        name: LOW_POTENTIAL_SEARCH_TERMS,
      }
    );
  },
};
