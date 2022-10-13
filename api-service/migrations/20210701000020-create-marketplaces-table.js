'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('marketplaces', {
      marketplaceId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      defaultCurrencyCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      defaultLanguageCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      domainName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isAllowed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('marketplaces');
  },
};
