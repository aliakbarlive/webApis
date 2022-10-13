'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('syncReports', {
      syncReportId: {
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
      date: Sequelize.DATEONLY,
      startDate: Sequelize.DATE,
      endDate: Sequelize.DATE,
      status: {
        type: Sequelize.ENUM(
          'STARTED',
          'REQUESTING',
          'REQUESTED',
          'PROCESSING',
          'PROCESSED',
          'FAILED'
        ),
        allowNull: false,
        defaultValue: 'STARTED',
      },
      referenceId: {
        type: Sequelize.STRING,
      },
      meta: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      startedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      completedAt: Sequelize.DATE,
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
        defaultValue: 'Report pending on queue.',
      },
      processingTime: {
        type: Sequelize.INTEGER,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('syncReports');
  },
};
