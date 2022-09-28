'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advAdGroups', {
      advAdGroupId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: false,
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      defaultBid: {
        type: Sequelize.DECIMAL,
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
      syncAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advAdGroups');
  },
};
