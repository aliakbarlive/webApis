'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('creditNotes', {
      creditNoteId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      zohoCreditNoteId: {
        type: Sequelize.STRING,
      },
      zohoCreditNoteNumber: {
        type: Sequelize.STRING,
      },
      cellId: {
        type: Sequelize.INTEGER,
      },
      customerId: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      terms: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          'pending',
          'approved',
          'denied',
          'cancelled',
          'manually-approved',
        ],
        allowNull: false,
      },
      dateApplied: {
        type: Sequelize.DATE,
      },
      requestorId: {
        type: Sequelize.UUID,
      },
      approvedBy: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('creditNotes');
  },
};
