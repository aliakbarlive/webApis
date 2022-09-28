'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'totalRevenue',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'asinFullTitle',
          {
            type: Sequelize.DataTypes.TEXT,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'totalRevenue', {
          transaction,
        }),
        queryInterface.changeColumn(
          'leads',
          'asinFullTitle',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction }
        ),
      ]);
    });
  },
};
