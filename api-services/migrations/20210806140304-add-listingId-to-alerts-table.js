'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('alerts', 'listingId', {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'listings',
          schema: 'public',
        },
        key: 'listingId',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('alerts', 'listingId', {
      references: {
        model: {
          tableName: 'listings',
          schema: 'public',
        },
        key: 'listingId',
      },
    });
  },
};
