'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommissionComputedValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Commission }) {
      this.belongsTo(Commission, {
        foreignKey: 'commissionId',
        as: 'commission',
      });
    }
  }
  CommissionComputedValue.init(
    {
      commissionComputedId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      commissionId: DataTypes.BIGINT,
      total: DataTypes.DECIMAL,
      canAdd: DataTypes.BOOLEAN,
      data: DataTypes.JSON,
      computedMonth: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'CommissionComputedValue',
      tableName: 'commissionComputedValues',
    }
  );
  return CommissionComputedValue;
};
