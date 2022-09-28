'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resetPasswordToken: Sequelize.STRING,
      resetPasswordExpire: Sequelize.STRING,
      verifyEmailToken: Sequelize.STRING,
      verifyEmailExpire: Sequelize.DATE,
      isOnboarding: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isSPAPIAuthorized: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isAdvAPIAuthorized: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('users');
  },
};
