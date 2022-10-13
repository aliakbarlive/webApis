'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('advChangeCollections', {
      fields: [
        'advProfileId',
        'campaignType',
        'userId',
        'advOptimizationBatchId',
      ],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('advChangeCollections', [
      'advProfileId',
      'campaignType',
      'userId',
      'advOptimizationBatchId',
    ]);
  },
};
