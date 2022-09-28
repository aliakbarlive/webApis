'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_creditNotes_status" ADD VALUE \'queued\''
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'DELETE FROM pg_enum WHERE enumlabel = \'queued\' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = "enum_creditNotes_status")'
    );
  },
};
