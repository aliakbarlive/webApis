'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('agencyClients', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('agencyClients', 'deletedAt');
  },
};
