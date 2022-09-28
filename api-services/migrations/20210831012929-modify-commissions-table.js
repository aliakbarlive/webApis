'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'commissions',
          'subscriptionId',
          { type: Sequelize.STRING, allowNull: true },
          { transaction: t }
        ),
        queryInterface.changeColumn(
          'commissions',
          'accountId',
          { type: Sequelize.UUID, allowNull: false },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'commissions',
          'accountId',
          { type: Sequelize.UUID, allowNull: true },
          {
            transaction: t,
          }
        ),
        queryInterface.changeColumn(
          'commissions',
          'subscriptionId',
          { type: Sequelize.STRING, allowNull: false },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
