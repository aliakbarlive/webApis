'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advChangeRequestItems',
          'status',
          {
            type: Sequelize.STRING,
            defaultValue: 'pending',
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advChangeRequestItems',
          'advOptimizationId',
          {
            type: Sequelize.INTEGER,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advChangeRequestItems',
          'evaluatedBy',
          {
            type: Sequelize.UUID,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advChangeRequestItems',
          'evaluatedAt',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('advChangeRequestItems', 'status', {
          transaction,
        }),

        queryInterface.removeColumn(
          'advChangeRequestItems',
          'advOptimizationId',
          {
            transaction,
          }
        ),

        queryInterface.removeColumn('advChangeRequestItems', 'evaluatedBy', {
          transaction,
        }),

        queryInterface.removeColumn('advChangeRequestItems', 'evaluatedAt', {
          transaction,
        }),
      ]);
    });
  },
};
