'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'pitchedDate',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'currentEarnings',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'revenue',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'competitorBrandName',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'competitorSalesUnits',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'leadsRep',
          {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'users',
                schema: 'public',
              },
              key: 'userId',
            },
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'currentEarnings', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'pitchedDate', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'revenue', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'competitorBrandName', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'competitorSalesUnits', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'leadsRep', {
          transaction,
        }),
      ]);
    });
  },
};
