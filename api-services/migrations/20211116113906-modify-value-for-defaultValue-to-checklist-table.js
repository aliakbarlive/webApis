'use strict';

const INTRODUCTION = 'Introduction';
const GET_AMAZON_SUB_USER_ACCESS_AND_MWS_TOKEN =
  'Get Amazon Sub User Access and MWS Token';
const SETUP_MANAGE_BY_STATS = 'Setup Manage By Stats';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify([
          {
            name: 'Email',
            value: 'Email template value',
          },
        ]),
      },
      {
        name: INTRODUCTION,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify([
          {
            name: 'Email',
            value: 'Email template value',
          },
        ]),
      },
      {
        name: GET_AMAZON_SUB_USER_ACCESS_AND_MWS_TOKEN,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify([
          {
            name: 'Setup Email',
            value: 'Email template value',
          },
          {
            name: 'Follow Up Email',
            value: 'Email template value',
          },
        ]),
      },
      {
        name: SETUP_MANAGE_BY_STATS,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify([]),
      },
      {
        name: INTRODUCTION,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify([]),
      },
      {
        name: GET_AMAZON_SUB_USER_ACCESS_AND_MWS_TOKEN,
      }
    );

    await queryInterface.bulkUpdate(
      'checklists',
      {
        defaultValue: JSON.stringify([]),
      },
      {
        name: SETUP_MANAGE_BY_STATS,
      }
    );
  },
};
