'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ratingRecords', {
      RatingRecordId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      listingId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'ratings',
            schema: 'public',
          },
          key: 'listingId',
        },
      },
      overallRating: Sequelize.DECIMAL,
      breakdown: Sequelize.JSONB,
      ratingsTotal: Sequelize.INTEGER,
      ratingDate: Sequelize.DATE,
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
    await queryInterface.dropTable('ratingRecords');
  },
};
