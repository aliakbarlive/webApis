'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subscriptions', 'salesPersonId', {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subscriptions', 'salesPersonId');
  },
};
