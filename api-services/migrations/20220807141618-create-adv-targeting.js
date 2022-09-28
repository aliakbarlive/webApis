'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advTargetings', {
      advTargetingId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      advTargetId: Sequelize.BIGINT,
      advKeywordId: Sequelize.BIGINT,
      matchType: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advTargetings');
  },
};
