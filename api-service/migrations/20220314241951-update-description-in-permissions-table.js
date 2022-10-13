'use strict';

const REVIEWS_VIEW = 'reviews.view';
const CLIENTS_PROFILE_VIEW = 'clients.profile.view';
const CLIENTS_PROFILE_EDIT = 'clients.profile.edit';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'View Reviews page',
      },
      {
        access: REVIEWS_VIEW,
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'View clients profile',
      },
      {
        access: CLIENTS_PROFILE_VIEW,
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Update clients profile',
      },
      {
        access: CLIENTS_PROFILE_EDIT,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: null,
      },
      {
        access: REVIEWS_VIEW,
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: null,
      },
      {
        access: CLIENTS_PROFILE_VIEW,
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: null,
      },
      {
        access: CLIENTS_PROFILE_EDIT,
      }
    );
  },
};
