'use strict';

const UNPROFITABLE_KEYWORDS_AGGRESSIVE =
  'Unprofitable KWs BE-50 ACoS [aggressive]';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'advRules',
      {
        actionData: JSON.stringify({
          type: 'decreaseBy',
          value: { type: 'percentage', value: 10 },
        }),
      },
      {
        name: UNPROFITABLE_KEYWORDS_AGGRESSIVE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'advRules',
      {
        actionData: JSON.stringify({
          type: 'decreaseBy',
          value: { type: 'percentage', value: 20 },
        }),
      },
      {
        name: UNPROFITABLE_KEYWORDS_AGGRESSIVE,
      }
    );
  },
};
