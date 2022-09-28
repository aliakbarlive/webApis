'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advNegativeTargets', {
      advNegativeTargetId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      expressionType: {
        type: Sequelize.ENUM('auto', 'manual'),
        allowNull: false,
      },
      expression: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      targetingText: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('advNegativeTargets');
  },
};
