'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvRuleProduct extends Model {
    static associate({ AdvRule }) {
      this.belongsTo(AdvRule, { foreignKey: 'advRuleId', as: 'rule' });
    }
  }
  AdvRuleProduct.init(
    {
      advRuleProductId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advRuleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      asin: {
        type: DataTypes.STRING,
      },
      sku: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'AdvRuleProduct',
      tableName: 'advRuleProducts',
      timestamps: false,
    }
  );
  return AdvRuleProduct;
};
