'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advRules', {
      advRuleId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      campaignType: {
        type: Sequelize.ENUM(
          'sponsoredProducts',
          'sponsoredBrands',
          'sponsoredDisplay'
        ),
        allowNull: false,
      },
      recordType: {
        type: Sequelize.ENUM(
          'campaigns',
          'adGroups',
          'keywords',
          'targets',
          'productAds',
          'searchTerms'
        ),
        allowNull: false,
      },
      filters: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      advRuleActionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advRuleActions',
            schema: 'public',
          },
          key: 'advRuleActionId',
        },
      },
      actionData: {
        type: Sequelize.JSONB,
      },
      predefined: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advRules');
  },
};
