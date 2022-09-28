'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advProfiles', {
      advProfileId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: false,
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
      dailyBudget: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('advProfiles');
  },
};
