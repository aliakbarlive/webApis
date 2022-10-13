'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('safetReimbursementEvents', {
      safetReimbursementEventId: {
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
      postedDate: {
        type: Sequelize.DATE,
      },
      safetClaimId: {
        type: Sequelize.STRING,
      },
      reasonCode: {
        type: Sequelize.STRING,
      },
      reimbursedCurrencyCode: {
        type: Sequelize.STRING,
      },
      reimbursedCurrencyAmount: {
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
    await queryInterface.dropTable('safetReimbursementEvents');
  },
};
