'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advRuleProducts', {
      advRuleProductId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      advRuleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advRules',
            schema: 'public',
          },
          key: 'advRuleId',
        },
      },
      asin: {
        type: Sequelize.STRING,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advRuleProducts');
  },
};
