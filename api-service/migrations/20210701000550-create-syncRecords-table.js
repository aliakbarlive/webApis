'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('syncRecords', {
      syncRecordId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      syncType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dataType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      syncDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pendingReports: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalReports: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      completedAt: {
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
    await queryInterface.dropTable('syncRecords');
  },
};
