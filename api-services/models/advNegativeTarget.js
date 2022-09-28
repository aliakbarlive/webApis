'use strict';
const { Model } = require('sequelize');
const AdvAdGroup = require('./advAdGroup');

module.exports = (sequelize, DataTypes) => {
  class AdvNegativeTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvAdGroup }) {
      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });
    }

    static async bulkSync(records) {
      const attrs = Object.keys(this.rawAttributes);
      records = records.map((record) => {
        record.advNegativeTargetId = record.targetId;
        record.targetingText = sequelize.models.AdvTarget.formatExpression(
          record.expression
        );

        Object.keys(record).forEach((key) => {
          if (!attrs.includes(key)) {
            delete record[key];
          }
        });
        return record;
      });

      records = await this.bulkCreate(records, {
        updateOnDuplicate: attrs,
      });
    }
  }
  AdvNegativeTarget.init(
    {
      advNegativeTargetId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: AdvAdGroup,
          key: 'advAdGroupId',
        },
      },
      expressionType: {
        type: DataTypes.ENUM('auto', 'manual'),
        allowNull: false,
      },
      expression: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      targetingText: DataTypes.STRING,
      state: {
        type: DataTypes.ENUM('enabled', 'paused', 'archived'),
        allowNull: false,
      },
      servingStatus: DataTypes.STRING,
      syncAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvNegativeTarget',
      tableName: 'advNegativeTargets',
      timestamps: false,
    }
  );
  return AdvNegativeTarget;
};
