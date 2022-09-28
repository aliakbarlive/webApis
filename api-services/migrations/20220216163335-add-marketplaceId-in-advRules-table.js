'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('advRules', 'marketplaceId', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'marketplaces',
          schema: 'public',
        },
        key: 'marketplaceId',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('advRules', 'marketplaceId');
  },
};
