'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leads', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leads', 'status', {
      type: Sequelize.ENUM(
        'PrePitch',
        'PP-Approved',
        'PP-Revision-Needed',
        'PP-Rejected',
        'Pitched-LL',
        'Direct-Booking',
        'Positive-Response',
        'Neutral-Response',
        'Call-Booked',
        'RepliedTo'
      ),
      allowNull: false,
      defaultValue: 'PrePitch',
    });
  },
};
