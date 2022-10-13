'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'checklists',
      [
        {
          name: 'Introduction',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Get Amazon Sub User Access and MWS Token',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Get Client Assets',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Brand Onboarding',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Setup Manage By Stats',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Create Copies, Listing Images, A+ Content, Brand Page',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'PPC Discussion and Strategies',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Product Review Discussion',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Listing Update',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Hero Image A/B Testing',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Listing Optimization',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'PPC Optimization',
          defaultToggle: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('checklists', null, {});
  },
};
