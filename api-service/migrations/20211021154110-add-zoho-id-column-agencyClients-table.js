'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('agencyClients', 'zohoId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('agencyClients', 'zohoId');
  },
};
