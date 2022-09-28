'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'approvedDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'revisionDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'rejectedDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'dateOfCallScreenshot',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'responseDateCallScreenshot',
          {
            type: Sequelize.TEXT,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'approvedDate', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'revisionDate', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'rejectedDate', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'dateOfCallScreenshot', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'responseDateCallScreenshot', {
          transaction,
        }),
      ]);
    });
  },
};
