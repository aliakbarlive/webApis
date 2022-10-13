'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('upsellOrders', 'status', {
      type: Sequelize.ENUM('pending', 'in-progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('upsellOrders', 'status'),
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_upsellOrders_status";'
        ),
      ]);
    });
  },
};
