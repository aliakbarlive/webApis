'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'checklists',
          'checklistType',
          {
            type: Sequelize.ENUM,
            values: ['none', 'email', 'file', 'form', 'text', 'url', 'radio'],
            defaultValue: 'none',
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'checklists',
          'defaultValue',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('checklists', 'checklistType', {
          transaction: t,
        }),
        queryInterface.removeColumn('checklists', 'defaultValue', {
          transaction: t,
        }),
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_checklists_checklistType";',
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
