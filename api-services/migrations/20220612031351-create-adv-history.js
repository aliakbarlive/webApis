'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advHistories', {
      advProfileId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      entityType: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      entityId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      changeType: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
      },
      previousValue: {
        type: Sequelize.STRING,
      },
      newValue: {
        type: Sequelize.STRING,
      },
      metadata: {
        type: Sequelize.JSONB,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advHistories');
  },
};
