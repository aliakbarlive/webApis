'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('advReports');
    } catch (error) {}

    await queryInterface.createTable('advReports', {
      advReportId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      generatedByUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      downloadUrl: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      campaignType: {
        type: Sequelize.STRING,
      },
      options: {
        type: Sequelize.JSONB,
      },
      data: {
        type: Sequelize.JSONB,
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
    await queryInterface.dropTable('advReports');
  },
};
