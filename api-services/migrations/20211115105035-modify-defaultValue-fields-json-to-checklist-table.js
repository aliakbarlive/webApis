'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('checklists', 'defaultValue', {
      type: 'JSONB USING CAST ("defaultValue" as JSONB)',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('checklists', 'defaultValue', {
      type: Sequelize.TEXT,
    });
  },
};
