'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('inventoryItems', 'leadTime', {
      type: Sequelize.INTEGER,
      defaultValue: 30,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('inventoryItems', 'leadTime');
  },
};
