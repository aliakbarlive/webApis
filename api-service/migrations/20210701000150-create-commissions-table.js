'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('commissions', {
      commissionId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      subscriptionId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'subscriptions',
            schema: 'public',
          },
          key: 'subscriptionId',
        },
      },
      marketplaceId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'marketplaces',
            schema: 'public',
          },
          key: 'marketplaceId',
        },
      },
      rate: { type: Sequelize.DECIMAL },
      type: {
        type: Sequelize.ENUM,
        values: ['gross', 'benchmark', 'rolling'],
        defaultValue: 'gross',
      },
      monthThreshold: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      preContractAvgBenchmark: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      commencedAt: { type: Sequelize.DATE },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('commissions');
  },
};
