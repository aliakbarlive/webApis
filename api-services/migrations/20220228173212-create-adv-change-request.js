'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advChangeRequests', {
      advChangeRequestId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      advProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          key: 'advProfileId',
          model: { tableName: 'advProfiles', schema: 'public' },
        },
      },
      requestedBy: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      description: {
        type: Sequelize.TEXT,
      },
      evaluatedBy: {
        type: Sequelize.UUID,
      },
      evaluatedAt: {
        type: Sequelize.DATE,
      },
      requestedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('advChangeRequests');
  },
};
