'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TYPE enum_roles_level ADD VALUE 'system'"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DELETE FROM pg_enum WHERE enumlabel = 'system' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_roles_level')"
    );
  },
};
