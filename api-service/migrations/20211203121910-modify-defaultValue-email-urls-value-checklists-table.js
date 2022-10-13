'use strict';

// Checklist: Create Copies, Listing Images, A+ Content, Brand Page

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify({
          copiesUrl:
            '<div>Hi {{name}}, <br/><br/>Here is the Copies URL: {{copiesUrl}}</div>',
          listingImageUrl:
            '<div>Hi {{name}}, <br/><br/>Here is the Listing Image URL: {{listingImageUrl}}</div>',
          aPlusContentUrl:
            '<div>Hi {{name}}, <br/><br/>Here is the A+ Content URL: {{aPlusContentUrl}}</div>',
          brandPageUrl:
            '<div>Hi {{name}}, <br/><br/>Here is the Brand Page URL: {{brandPageUrl}}</div>',
        }),
      },
      {
        checklistId: 6,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: null,
      },
      {
        checklistId: 6,
      }
    );
  },
};
