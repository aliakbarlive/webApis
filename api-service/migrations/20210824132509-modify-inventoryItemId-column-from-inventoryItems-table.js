'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(
      'ALTER TABLE "inventoryItems" ALTER COLUMN "inventoryItemId" TYPE bigint;'
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(
      'ALTER TABLE "inventoryItems" ALTER COLUMN "inventoryItemId" TYPE integer;'
    );
  },
};
