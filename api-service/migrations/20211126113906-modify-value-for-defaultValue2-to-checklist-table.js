'use strict';

const PPC_DISCUSSION_AND_STRATEGIES = 'PPC Discussion and Strategies';
const PRODUCT_REVIEW_DISCUSSION = 'Product Review Discussion';
const LISTING_UPDATE = 'Listing Update';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'checklists',
      {
        checklistType: 'text',
        defaultValue: JSON.stringify([
          {
            key: 'ProposedPlan',
            type: 'textArea',
            value: '',
          },
          {
            key: 'ApproveProposal',
            type: 'toggle',
            value: false,
          },
        ]),
      },
      {
        name: PPC_DISCUSSION_AND_STRATEGIES,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        checklistType: 'radio',
        defaultValue: JSON.stringify([
          {
            key: 'InvoicePaid',
            type: 'toggle',
            value: false,
          },
          {
            key: 'CampaignLaunched',
            type: 'toggle',
            value: false,
          },
          {
            key: 'CampaignCompleted',
            type: 'toggle',
            value: false,
          },
        ]),
      },
      {
        name: PRODUCT_REVIEW_DISCUSSION,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        checklistType: 'radio',
        defaultValue: JSON.stringify([
          {
            key: 'Copies',
            type: 'toggle',
            value: false,
          },
          {
            key: 'Images',
            type: 'toggle',
            value: false,
          },
          {
            key: 'A+Content',
            type: 'toggle',
            value: false,
          },
          {
            key: 'BrandingPage',
            type: 'toggle',
            value: false,
          },
        ]),
      },
      {
        name: LISTING_UPDATE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'checklists',
      {
        checklistType: 'none',
        defaultValue: JSON.stringify([]),
      },
      {
        name: PPC_DISCUSSION_AND_STRATEGIES,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        checklistType: 'none',
        defaultValue: JSON.stringify([]),
      },
      {
        name: PRODUCT_REVIEW_DISCUSSION,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        checklistType: 'none',
        defaultValue: JSON.stringify([]),
      },
      {
        name: LISTING_UPDATE,
      }
    );
  },
};
