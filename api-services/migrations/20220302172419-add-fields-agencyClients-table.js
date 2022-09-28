'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'agencyClients',
          'contractSigned',
          {
            type: Sequelize.DataTypes.DATE,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'contactName',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'contactName2',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'primaryEmail',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'secondaryEmail',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'thirdEmail',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'service',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'agencyClients',
          'accountStatus',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('agencyClients', 'contractSigned', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'contactName', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'contactName2', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'secondaryEmail', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'thirdEmail', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'service', {
          transaction: t,
        }),
        queryInterface.removeColumn('agencyClients', 'accountStatus', {
          transaction: t,
        }),
      ]);
    });
  },
};
