'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'billingCurrencies',
      [
        {
          pricebookId: '2599570000000102001',
          currencyCode: 'USD',
          currencyId: '2599570000000000097',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   pricebookId: '2599570000000101001',
        //   currencyCode: 'CAD',
        //   currencyId: '2599570000000000101',
        //   status: 'active',
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ],

      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('billingCurrencies', null, {});
  },
};
