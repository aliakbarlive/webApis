'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('agencyClients', 'draftCommission', {
      type: Sequelize.JSONB,
      nullable: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('agencyClients', 'draftCommission');
  },
};
