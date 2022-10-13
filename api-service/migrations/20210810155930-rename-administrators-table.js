'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('administrators', 'employees');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('employees', 'administrators');
  },
};
