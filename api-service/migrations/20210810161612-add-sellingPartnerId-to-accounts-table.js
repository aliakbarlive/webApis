'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('accounts', 'sellingPartnerId', {
      type: Sequelize.STRING,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('accounts', 'sellingPartnerId');
  },
};
