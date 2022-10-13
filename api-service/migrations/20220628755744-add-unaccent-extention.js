'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query('CREATE EXTENSION unaccent;'),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query('DROP EXTENSION unaccent;'),
      ]);
    });
  },
};
