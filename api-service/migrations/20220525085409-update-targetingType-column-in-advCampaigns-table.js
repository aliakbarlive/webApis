'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('advCampaigns', 'targetingType', {
      type: Sequelize.STRING,
      defaultValue: 'manual',
    });

    await queryInterface.bulkUpdate(
      'advCampaigns',
      {
        targetingType: 'manual',
      },
      {
        targetingType: {
          [Sequelize.Op.is]: null,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('advCampaigns', 'targetingType', {
      type: Sequelize.STRING,
    });
  },
};
