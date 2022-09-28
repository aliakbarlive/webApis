'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'secondaryLeadFirstName',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'secondaryLeadLastName',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
            'leads',
            'secondaryPhoneNumber',
            {
              type: Sequelize.STRING,
            },
            { transaction }
          ), queryInterface.addColumn(
            'leads',
            'secondaryEmailAddress',
            {
              type: Sequelize.STRING,
            },
            { transaction }
          ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'secondaryLeadFirstName', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'secondaryLastName', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'secondaryPhoneNumber', {
            transaction,
          }),
          queryInterface.removeColumn('leads', 'secondaryEmailAddress', {
            transaction,
          }),
      ]);
    });
  },
};
