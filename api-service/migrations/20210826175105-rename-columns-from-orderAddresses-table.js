'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('orderAddresses', 'shipCity', 'city', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'orderAddresses',
          'shipState',
          'stateOrRegion',
          { transaction: t }
        ),
        queryInterface.renameColumn(
          'orderAddresses',
          'shipPostalCode',
          'postalCode',
          { transaction: t }
        ),
        queryInterface.renameColumn(
          'orderAddresses',
          'shipCountry',
          'countryCode',
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('orderAddresses', 'city', 'shipCity', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'orderAddresses',
          'stateOrRegion',
          'shipState',
          { transaction: t }
        ),
        queryInterface.renameColumn(
          'orderAddresses',
          'postalCode',
          'shipPostalCode',
          { transaction: t }
        ),
        queryInterface.renameColumn(
          'orderAddresses',
          'countryCode',
          'shipCountry',
          { transaction: t }
        ),
      ]);
    });
  },
};
