'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'upsellItems',
          'description',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'upsellLogs',
          'description',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'upsellDetails',
          'description',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
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
          'upsellItems',
          'description',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'upsellLogs',
          'description',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'upsellDetails',
          'description',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
      ]);
    });
  },
};
