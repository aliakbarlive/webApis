'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InboundFBAShipment extends Model {
    static associate({ InboundFBAShipmentItem, Account }) {
      this.hasMany(InboundFBAShipmentItem, {
        foreignKey: 'inboundFBAShipmentId',
        constraints: false,
        as: 'items',
      });
      this.belongsTo(Account, { foreignKey: 'accountId' });
    }
  }
  InboundFBAShipment.init(
    {
      inboundFBAShipmentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      inboundFBAShipmentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
      },
      shipFromAddress: DataTypes.JSONB,
      destinationFulfillmentCenterId: DataTypes.STRING,
      inboundFBAShipmentStatus: {
        type: DataTypes.ENUM(
          'WORKING',
          'RECEIVING',
          'CANCELLED',
          'DELETED',
          'ERROR',
          'SHIPPED',
          'IN_TRANSIT',
          'CLOSED',
          'DELIVERED',
          'CHECKED_IN'
        ),
        allowNull: false,
      },
      labelPrepType: DataTypes.STRING,
      areCasesRequired: DataTypes.BOOLEAN,
      boxContentsSource: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'inboundFBAShipments',
      modelName: 'InboundFBAShipment',
    }
  );
  return InboundFBAShipment;
};
