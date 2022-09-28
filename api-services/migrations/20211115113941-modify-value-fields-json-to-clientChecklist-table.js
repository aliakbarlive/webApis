'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('clientChecklists', 'value', {
      type: 'JSONB USING CAST ("value" as JSONB)',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('clientChecklists', 'value', {
      type: Sequelize.TEXT,
    });
  },
};
