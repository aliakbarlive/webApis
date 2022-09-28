'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvRulePortfolio extends Model {
    static associate({ AdvPortfolio, AdvRule }) {
      this.belongsTo(AdvPortfolio, { foreignKey: 'advPortfolioId' });
      this.belongsTo(AdvRule, { foreignKey: 'advRuleId' });
    }
  }
  AdvRulePortfolio.init(
    {
      advPortfolioId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      advRuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AdvRulePortfolio',
      tableName: 'advRulePortfolios',
      timestamps: false,
    }
  );
  return AdvRulePortfolio;
};
