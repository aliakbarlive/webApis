'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'agencyClients',
          'categoryList',
          {
            type: Sequelize.JSONB,
            nullable: true,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'asinList',
          {
            type: Sequelize.JSONB,
            nullable: true,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('agencyClients', 'categoryList', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'asinList', {
          transaction: t,
        }),
      ]);
    });
  },
};
