'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('upsellComments', {
      upsellCommentId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      upsellOrderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'upsellOrders',
            schema: 'public',
          },
          key: 'upsellOrderId',
        },
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      commentedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
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
    await queryInterface.dropTable('upsellComments');
  },
};
