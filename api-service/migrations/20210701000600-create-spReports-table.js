'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('spReports', {
      spReportId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      syncRecordId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'syncRecords',
            schema: 'public',
          },
          key: 'syncRecordId',
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'STARTED',
      },
      reportId: {
        type: Sequelize.STRING,
      },
      startDate: Sequelize.DATE,
      endDate: Sequelize.DATE,
      reportLink: {
        type: Sequelize.STRING,
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      completedAt: {
        type: Sequelize.DATE,
      },
      jobId: {
        type: Sequelize.STRING,
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      onQueue: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      message: {
        type: Sequelize.TEXT,
        defaultValue: 'Generation of report pending on queue.',
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
    await queryInterface.dropTable('spReports');
  },
};
