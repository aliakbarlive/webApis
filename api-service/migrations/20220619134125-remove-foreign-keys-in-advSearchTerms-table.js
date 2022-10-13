'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint(
        'advSearchTerms',
        'advSearchTerms_advAdGroupId_fkey'
      );

      await queryInterface.removeConstraint(
        'advSearchTerms',
        'advSearchTerms_advCampaignId_fkey'
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
