'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'orderAddresses',
          'name',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'addressLine1',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'addressLine2',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'addressLine3',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'county',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'district',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'municipality',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'phone',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'orderAddresses',
          'addressType',
          {
            type: Sequelize.STRING,
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('orderAddresses', 'name', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'addressLine1', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'addressLine2', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'addressLine3', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'county', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'district', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'municipality', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'phone', {
          transaction: t,
        }),
        queryInterface.removeColumn('orderAddresses', 'addressType', {
          transaction: t,
        }),
      ]);
    });
  },
};
