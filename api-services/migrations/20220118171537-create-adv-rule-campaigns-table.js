'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advRuleCampaigns', {
      advRuleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'advRules',
            schema: 'public',
          },
          key: 'advRuleId',
        },
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'advCampaigns',
            schema: 'public',
          },
          key: 'advCampaignId',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advRuleCampaigns');
  },
};
