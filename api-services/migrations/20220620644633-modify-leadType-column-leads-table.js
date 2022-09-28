'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leads', 'leadType', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'None',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leads', 'leadType', {
      type: Sequelize.ENUM('None', 'FBA', 'AMZ'),
      allowNull: false,
      defaultValue: 'None',
    });
  },
};
