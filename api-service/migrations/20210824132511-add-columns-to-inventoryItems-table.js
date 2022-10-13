'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'inventoryItems',
          'lastUpdatedTime',
          {
            type: Sequelize.DATE,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'totalQuantity',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('inventoryItems', 'lastUpdatedTime', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'totalQuantity', {
          transaction: t,
        }),
      ]);
    });
  },
};
