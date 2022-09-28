'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TYPE enum_commissions_type ADD VALUE 'tiered'"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DELETE FROM pg_enum WHERE enumlabel = 'tiered' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_commissions_type')"
    );
  },
};
