'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('upsellDetails', {
      upsellDetailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      upsellId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'upsells',
            schema: 'public',
          },
          key: 'upsellId',
        },
      },
      upsellItemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'upsellItems',
            schema: 'public',
          },
          key: 'upsellItemId',
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      qty: {
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
    await queryInterface.dropTable('upsellDetails');
  },
};
