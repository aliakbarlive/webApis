'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_checklists_checklistType" ADD VALUE \'checkbox\''
    );
    await queryInterface.bulkInsert('checklists', [
      {
        checklistId: 13,
        name: 'Client Assignments',
        defaultToggle: true,
        checklistType: 'checkbox',
        defaultValue: JSON.stringify([
          {
            name: 'Project Manager',
            assigned: false,
          },
          {
            name: 'Account Manager',
            assigned: false,
          },
          {
            name: 'Account Coordinator',
            assigned: false,
          },
          {
            name: 'Marketplace Specialist',
            assigned: false,
          },
          {
            name: 'PPC Specialist',
            assigned: false,
          },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DELETE FROM pg_enum WHERE enumlabel = 'checkbox' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_checklists_checklistType')"
    );
    await queryInterface.bulkDelete('checklists', {
      checklistId: 13,
    });
  },
};
