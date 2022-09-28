'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('clientChecklists', 'transactionDate', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('clientChecklists', 'transactionDate');
  },
};
