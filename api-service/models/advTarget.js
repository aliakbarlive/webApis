'use strict';
const { Model } = require('sequelize');
const AdvAdGroup = require('./advAdGroup');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class AdvTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvAdGroup, AdvSearchTerm, AdvTargetRecord }) {
      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvSearchTerm, {
        foreignKey: 'advTargetId',
        constraints: false,
      });

      this.hasMany(AdvTargetRecord, {
        foreignKey: 'advTargetId',
        as: 'records',
        constraints: false,
      });
    }

    static formatExpression(expression) {
      if (!expression) return null;

      const typeFormatter = (type) => {
        return type
          .replace('queryHighRelMatches', 'close-match')
          .replace('asinAccessoryRelated', 'complements')
          .replace('queryBroadRelMatches', 'loose-match')
          .replace('asinSubstituteRelated', 'substitutes')
          .replace('lookback', 'lookback=')
          .replace('SameAs', '=')
          .replace('LessThan', '<')
          .replace('GreaterThan', '>')
          .replace('Between', '=');
      };

      try {
        const expressionsArray = expression.map(({ type, value }) => {
          const formattedType = typeFormatter(type);

          if (!value) {
            return formattedType;
          }

          if (Array.isArray(value)) {
            const formattedValue = value.map((val) => {
              const formattedSubType = typeFormatter(val.type);
              if (!val.value) return formattedSubType;
              return `${formattedSubType}${val.value}`;
            });

            return `${formattedType}=(${formattedValue.toString()})`;
          }

          return `${formattedType}${value}`;
        });
        return expressionsArray.toString();
      } catch (error) {
        return null;
      }
    }

    static async bulkSync(records, mainSync = true) {
      return new Promise(async (resolve, reject) => {
        try {
          const attrs = Object.keys(this.rawAttributes);

          records = _.uniqBy(_.cloneDeep(records), 'targetId').map((r) => {
            let obj = r;
            r.targetingText = AdvTarget.formatExpression(r.expression);

            Object.keys(obj).forEach((key) => {
              if (!attrs.includes(key)) {
                delete obj[key];
              }
            });

            return obj;
          });

          records = await this.bulkCreate(records, {
            updateOnDuplicate: mainSync
              ? attrs
              : ['expressionType', 'targetingExpression', 'targetingText'],
          });

          return resolve(records);
        } catch (error) {
          return reject(error);
        }
      });
    }
  }

  AdvTarget.init(
    {
      advTargetId: {
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
      expressionType: DataTypes.ENUM('auto', 'manual'),
      expression: DataTypes.JSONB,
      bid: DataTypes.DECIMAL,
      targetingExpression: DataTypes.STRING,
      targetingText: DataTypes.STRING,
      state: DataTypes.ENUM('enabled', 'paused', 'archived'),
      servingStatus: DataTypes.STRING,
      syncAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvTarget',
      tableName: 'advTargets',
      timestamps: false,
    }
  );
  return AdvTarget;
};
