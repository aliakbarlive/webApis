'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('adjustmentEvents', {
      adjustmentEventId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      adjustmentType: {
        type: Sequelize.STRING,
      },
      postedDate: {
        type: Sequelize.DATE,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      currencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
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
    await queryInterface.dropTable('adjustmentEvents');
  },
};
