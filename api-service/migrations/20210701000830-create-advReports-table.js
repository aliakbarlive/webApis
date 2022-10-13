'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advReports', {
      advReportId: {
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
      advProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'advProfiles',
            schema: 'public',
          },
          key: 'advProfileId',
        },
      },
      advReportEntityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advReportEntities',
            schema: 'public',
          },
          key: 'advReportEntityId',
        },
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
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
      reportId: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM('snapshot', 'performance'),
        allowNull: false,
      },
      startedAt: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('advReports');
  },
};
