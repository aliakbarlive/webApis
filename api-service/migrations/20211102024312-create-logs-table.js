'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('logs', {
      logId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      logType: DataTypes.STRING,
      referenceId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM,
        values: ['success', 'error', 'warning', 'info', 'fatal'],
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('logs', {
          transaction: t,
        }),
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_logs_status";',
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
