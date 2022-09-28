'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('safetReimbursementItems', {
      safetReimbursementItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      safetReimbursementEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'safetReimbursementEvents',
            schema: 'public',
          },
          key: 'safetReimbursementEventId',
        },
      },
      productDescription: {
        type: Sequelize.TEXT,
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('safetReimbursementItems');
  },
};
