'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'advCampaigns',
          'adFormat',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advCampaigns',
          'creative',
          {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advCampaigns',
          'landingPage',
          {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'advCampaigns',
          'supplySource',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('advCampaigns', 'addFormat', {
          transaction,
        }),

        queryInterface.removeColumn('advCampaigns', 'creative', {
          transaction,
        }),

        queryInterface.removeColumn('advCampaigns', 'landingPage', {
          transaction,
        }),

        queryInterface.removeColumn('advCampaigns', 'supplySource', {
          transaction,
        }),
      ]);
    });
  },
};
