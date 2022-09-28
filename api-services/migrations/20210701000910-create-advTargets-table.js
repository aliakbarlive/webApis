'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advTargets', {
      advTargetId: {
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
      },
      expression: {
        type: Sequelize.JSONB,
      },
      bid: {
        type: Sequelize.DECIMAL,
      },
      targetingExpression: {
        type: Sequelize.STRING,
      },
      targetingText: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.ENUM('enabled', 'paused', 'archived'),
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
    await queryInterface.dropTable('advTargets');
  },
};
