'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('advReports', 'clientId', {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('advReports', 'clientId');
  },
};
