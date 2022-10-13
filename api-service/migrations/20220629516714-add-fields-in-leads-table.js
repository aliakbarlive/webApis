'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'brandName',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'revisionText',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'leadLastName',
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
        queryInterface.removeColumn('leads', 'brandName', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'revisionText', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'leadLastName', {
          transaction,
        }),
      ]);
    });
  },
};
