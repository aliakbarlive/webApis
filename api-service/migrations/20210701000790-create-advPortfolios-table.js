'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advPortfolios', {
      advPortfolioId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: false,
      },
      advProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'advProfiles',
            schema: 'public',
          },
          key: 'advProfileId',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      budget: {
        type: Sequelize.JSONB,
      },
      inBudget: {
        type: Sequelize.BOOLEAN,
      },
      state: {
        type: Sequelize.ENUM('enabled', 'paused', 'archived'),
        allowNull: false,
      },
      servingStatus: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advPortfolios');
  },
};
