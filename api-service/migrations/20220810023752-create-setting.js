'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('settings', {
      key: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('settings');
  },
};
