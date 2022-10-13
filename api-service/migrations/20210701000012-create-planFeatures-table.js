'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('planFeatures', {
      planId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: {
            tableName: 'plans',
            schema: 'public',
          },
          key: 'planId',
        },
      },
      featureId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: {
            tableName: 'features',
            schema: 'public',
          },
          key: 'featureId',
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
    await queryInterface.dropTable('planFeatures');
  },
};
