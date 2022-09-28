'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leadSources', {
      leadSourceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      filename: {
        type: Sequelize.STRING,
      },
      extension: {
        type: Sequelize.STRING,
      },
      s3file: {
        type: Sequelize.STRING,
      },
      totalRows: {
        type: Sequelize.INTEGER,
      },
      inserted: {
        type: Sequelize.INTEGER,
      },
      skipped: {
        type: Sequelize.INTEGER,
      },
      uploadedBy: {
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
    await queryInterface.dropTable('leadSources');
  },
};
