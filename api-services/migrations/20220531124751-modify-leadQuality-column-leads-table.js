'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leads', 'leadQuality', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'None',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leads', 'leadQuality', {
      type: Sequelize.ENUM(
        'None',
        'Low',
        'Mid',
        'High',
        'Low-Mid',
        'Low-High',
        'Mid-High'
      ),
      allowNull: false,
      defaultValue: 'None',
    });
  },
};
