'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'Pending Approval',
          },
          { status: 'PrePitch' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'Approved',
          },
          { status: 'PP-Approved' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'Revision',
          },
          { status: 'PP-Revision-Needed' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'Rejected',
          },
          { status: 'PP-Rejected' },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'PrePitch',
          },
          { status: 'Pending Approval' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'PP-Approved',
          },
          { status: 'Approved' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'PP-Revision-Needed',
          },
          { status: 'Revision' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'leads',
          {
            status: 'PP-Rejected',
          },
          { status: 'Rejected' },
          { transaction }
        ),
      ]);
    });
  },
};
