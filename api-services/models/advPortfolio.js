'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvPortfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvProfile, AdvRule, AdvRulePortfolio, AdvCampaign }) {
      this.belongsTo(AdvProfile, { foreignKey: 'advProfileId' });

      this.hasMany(AdvCampaign, {
        foreignKey: 'advPortfolioId',
        constraints: false,
      });

      this.belongsToMany(AdvRule, {
        through: AdvRulePortfolio,
        foreignKey: 'advPortfolioId',
        as: 'rules',
      });
    }
  }
  AdvPortfolio.init(
    {
      advPortfolioId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        foreignKey: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      budget: DataTypes.JSONB,
      inBudget: {
        type: DataTypes.BOOLEAN,
        allowNullL: false,
      },
      state: {
        type: DataTypes.ENUM('enabled', 'paused', 'archived'),
        allowNull: false,
      },
      servingStatus: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'advPortfolios',
      modelName: 'AdvPortfolio',
      timestamps: false,
    }
  );
  return AdvPortfolio;
};
