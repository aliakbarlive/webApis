'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'leads',
          'website',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'companyLI',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'amzStoreFBAstoreFront',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'leadScreenShotURL',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'competitorScreenShotURL',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'linkedInProfileURL',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'leadPhotoURL',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'liAccount',
          {
            type: Sequelize.DataTypes.TEXT,
            defaultValue: undefined,
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.changeColumn(
          'leads',
          'website',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'companyLI',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'amzStoreFBAstoreFront',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'leadScreenShotURL',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'competitorScreenShotURL',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'linkedInProfileURL',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'leadPhotoURL',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'leads',
          'liAccount',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: undefined,
          },
          { transaction }
        ),
      ]);
    });
  },
};
