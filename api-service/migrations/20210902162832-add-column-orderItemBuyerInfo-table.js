'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderItemBuyerInfos', 'amazonOrderItemId', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'orderItemBuyerInfos',
      'amazonOrderItemId'
    );
  },
};
