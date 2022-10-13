'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const settings = [
      {
        key: 'advertising-analytics-export-pdf-height',
        value: 600,
      },
      {
        key: 'advertising-analytics-export-pdf-width',
        value: 1316,
      },
    ];

    await queryInterface.bulkInsert('settings', settings);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', {
      key: 'advertising-analytics-export-pdf-height',
    });

    await queryInterface.bulkDelete('permissions', {
      key: 'advertising-analytics-export-pdf-width',
    });
  },
};
