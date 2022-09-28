'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_inventory" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_orders" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_financialEvents" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_products" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_reviews" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_inboundFBAShipments" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_inboundFBAShipmentItems" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_advSnapshots" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_advPerformanceReport" ADD VALUE 'IN-PROGRESS'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_inventory" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_orders" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_financialEvents" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_products" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_reviews" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_inboundFBAShipments" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_inboundFBAShipmentItems" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_advSnapshots" ADD VALUE 'FAILED'`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_initialSyncStatus_advPerformanceReport" ADD VALUE 'FAILED'`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_inventory')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_orders')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_financialEvents')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_products')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_reviews')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_inboundFBAShipments')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_inboundFBAShipmentItems')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_advSnapshots')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'IN-PROGRESS' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_advPerformanceReport')`
    );

    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_inventory')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_orders')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_financialEvents')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_products')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_reviews')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_inboundFBAShipments')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_inboundFBAShipmentItems')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_advSnapshots')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'FAILED' AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_initialSyncStatus_advPerformanceReport')`
    );
  },
};
