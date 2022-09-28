'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('subscriptions', 'data', {
      type: Sequelize.DataTypes.JSONB,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('subscriptions', 'data');
  },
};
