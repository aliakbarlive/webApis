'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'leads',
          'asinFullTitle',
          {
            type: Sequelize.TEXT,
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
          'leads',
          'asinFullTitle',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
      ]);
    });
  },
};
