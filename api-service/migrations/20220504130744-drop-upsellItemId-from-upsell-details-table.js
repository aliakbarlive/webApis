'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('upsellDetails', 'upsellItemId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('upsellDetails', 'upsellItemId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: {
          tableName: 'upsellItems',
          schema: 'public',
        },
        key: 'upsellItemId',
      },
    });
  },
};
