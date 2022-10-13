'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate({ Account, Marketplace, TagRecord }) {
      this.belongsTo(Account, { foreignKey: 'accountId', constraints: false });
      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
        constraints: false,
      });
      this.hasMany(TagRecord, {
        foreignKey: 'tagId',
        constraints: false,
      });
    }
  }
  Tag.init(
    {
      tagId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'tags',
      modelName: 'Tag',
    }
  );
  return Tag;
};
