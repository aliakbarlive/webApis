'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'plans',
      [
        {
          name: 'free',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'basic',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'pro',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'agency',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
