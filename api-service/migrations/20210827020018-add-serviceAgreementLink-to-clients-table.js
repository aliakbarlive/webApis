'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('agencyClients', 'serviceAgreementLink', {
      type: Sequelize.TEXT,
      nullable: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('agencyClients', 'serviceAgreementLink');
  },
};
