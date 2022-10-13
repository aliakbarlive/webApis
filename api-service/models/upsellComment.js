'use strict';
const { Model } = require('sequelize');
const User = require('./user');
const UpsellOrder = require('./upsellOrder');

module.exports = (sequelize, DataTypes) => {
  class UpsellComment extends Model {
    static associate({ User }) {
      this.belongsTo(User, {
        foreignKey: 'commentedBy',
        as: 'commentedByUser',
      });
    }
  }
  UpsellComment.init(
    {
      upsellCommentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      upsellOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: UpsellOrder,
          key: 'upsellOrderId',
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      commentedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'userId',
        },
      },
    },
    {
      sequelize,
      tableName: 'upsellComments',
      modelName: 'UpsellComment',
    }
  );
  return UpsellComment;
};
