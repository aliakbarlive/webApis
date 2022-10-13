'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'advProductAds',
          'asin',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'advProductAds',
          'sku',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        ),
      ]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'advProductAds',
          'asin',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'advProductAds',
          'sku',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction }
        ),
      ]);
    });
  },
};
