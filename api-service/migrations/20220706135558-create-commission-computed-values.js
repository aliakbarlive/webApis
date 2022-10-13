'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('commissionComputedValues', {
      commissionComputedId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      commissionId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'commissions',
            schema: 'public',
          },
          key: 'commissionId',
        },
      },
      total: {
        type: Sequelize.NUMERIC,
      },
      data: {
        type: Sequelize.JSON,
      },
      canAdd: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      computedMonth: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('commissionComputedValues');
  },
};
