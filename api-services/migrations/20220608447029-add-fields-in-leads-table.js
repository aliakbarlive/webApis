'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'leads',
          'competitorsProduct2',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'address',
          {
            type: Sequelize.STRING,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'callAppointmentDate1',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'callAppointmentDate2',
          {
            type: Sequelize.DATE,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'leads',
          'callAppointmentDate3',
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
        queryInterface.removeColumn('leads', 'competitorsProduct2', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'address', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'callAppointmentDate1', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'callAppointmentDate2', {
          transaction,
        }),
        queryInterface.removeColumn('leads', 'callAppointmentDate3', {
          transaction,
        }),
      ]);
    });
  },
};
