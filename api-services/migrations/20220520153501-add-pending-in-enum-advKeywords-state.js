'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_advKeywords_state" ADD VALUE 'pending'`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'pending' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_advKeywords_state')`
    );
  },
};
