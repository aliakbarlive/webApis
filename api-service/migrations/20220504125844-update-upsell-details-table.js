'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'upsellDetails',
          'code',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'upsellDetails',
          'type',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'upsellDetails',
          'addonId',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('upsellDetails', 'code', { transaction }),
        queryInterface.removeColumn('upsellDetails', 'type', { transaction }),
        queryInterface.removeColumn('upsellDetails', 'addonId', {
          transaction,
        }),
      ]);
    });
  },
};
