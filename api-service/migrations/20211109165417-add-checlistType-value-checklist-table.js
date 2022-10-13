'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `UPDATE checklists SET "checklistType" = 'email', "defaultValue" = 'defaultValue' WHERE "checklistId" = 1`
        ),
        queryInterface.sequelize.query(
          `UPDATE checklists SET "checklistType" = 'email', "defaultValue" = 'defaultValue' WHERE "checklistId" = 2`
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `UPDATE checklists SET "checklistType" = 'none', "defaultValue" IS NULL WHERE "checklistId" = 1`
        ),
        queryInterface.sequelize.query(
          `UPDATE checklists SET "checklistType" = 'none', "defaultValue" IS NULL WHERE "checklistId" = 2`
        ),
      ]);
    });
  },
};
