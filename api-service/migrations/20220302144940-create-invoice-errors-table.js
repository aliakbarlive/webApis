'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoiceErrors', {
      invoiceErrorId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invoiceId: Sequelize.STRING,
      invoiceNumber: Sequelize.STRING,
      invoiceDate: Sequelize.DATE,
      accountId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      status: Sequelize.STRING,
      description: Sequelize.TEXT,
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
    await queryInterface.dropTable('invoiceErrors');
  },
};
