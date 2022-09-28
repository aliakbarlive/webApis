'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('advRulePortfolios', {
      advRuleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'advRuleId',
          model: { tableName: 'advRules', schema: 'public' },
        },
      },
      advPortfolioId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: { tableName: 'advPortfolios', schema: 'public' },
          key: 'advPortfolioId',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('advRulePortfolios');
  },
};
