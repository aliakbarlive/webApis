'use strict';
const { Model } = require('sequelize');
const InboundFBAShipment = require('./inboundFBAShipments');

module.exports = (sequelize, DataTypes) => {
  class InboundFBAShipmentItem extends Model {
    static associate({ InboundFBAShipment, InventoryItem }) {
      this.belongsTo(InboundFBAShipment, {
        foreignKey: 'inboundFBAShipmentId',
        constraints: false,
      });
      this.belongsTo(InventoryItem, {
        foreignKey: 'sellerSku',
        constraints: false,
      });
    }
  }
  InboundFBAShipmentItem.init(
    {
      inboundFBAShipmentItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      inboundFBAShipmentId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: InboundFBAShipment,
          key: 'inboundFBAShipmentId',
        },
      },
      sellerSku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fulfillmentNetworkSku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantityShipped: DataTypes.INTEGER,
      quantityReceived: DataTypes.INTEGER,
      quantityInCase: DataTypes.INTEGER,
      prepDetailsList: DataTypes.JSONB,
    },
    {
      sequelize,
      tableName: 'inboundFBAShipmentItems',
      modelName: 'InboundFBAShipmentItem',
    }
  );
  return InboundFBAShipmentItem;
};
