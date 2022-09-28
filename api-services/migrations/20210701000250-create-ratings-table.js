'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ratings', {
      listingId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      overallRating: Sequelize.DECIMAL,
      breakdown: Sequelize.JSONB,
      ratingsTotal: Sequelize.INTEGER,
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
    await queryInterface.dropTable('ratings');
  },
};
