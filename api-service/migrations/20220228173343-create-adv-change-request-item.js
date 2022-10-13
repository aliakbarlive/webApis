'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advChangeRequestItems', {
      advChangeRequestItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      advChangeRequestId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          key: 'advChangeRequestId',
          model: { tableName: 'advChangeRequests', schema: 'public' },
        },
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
      },
      data: {
        type: Sequelize.JSONB,
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
    await queryInterface.dropTable('advChangeRequestItems');
  },
};
