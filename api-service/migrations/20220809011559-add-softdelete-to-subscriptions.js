'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subscriptions', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subscriptions', 'deletedAt');
  },
};
