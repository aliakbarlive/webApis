'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leads', {
      leadId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sentFromAcct: {
        type: Sequelize.STRING,
      },
      lead: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      companyName: {
        type: Sequelize.STRING,
      },
      companyLI: {
        type: Sequelize.STRING,
      },
      website: {
        type: Sequelize.STRING,
      },
      leadType: {
        type: Sequelize.ENUM('None', 'FBA', 'AMZ'),
        allowNull: false,
        defaultValue: 'None',
      },
      country: {
        type: Sequelize.STRING,
      },
      leadQuality: {
        type: Sequelize.ENUM(
          'None',
          'Low',
          'Mid',
          'High',
          'Low-Mid',
          'Low-High',
          'Mid-High'
        ),
        allowNull: false,
        defaultValue: 'None',
      },
      amzStoreFBAstoreFront: {
        type: Sequelize.STRING,
      },
      leadScreenShotURL: {
        type: Sequelize.STRING,
      },
      competitorScreenShotURL: {
        type: Sequelize.STRING,
      },
      linkedInProfileURL: {
        type: Sequelize.STRING,
      },
      leadPhotoURL: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.TEXT,
      },
      salesRep: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
      },
      processedBy: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
      },
      typeOfResponse: {
        type: Sequelize.ENUM(
          'None',
          'DirectBooking',
          'NeutralResponse',
          'NeutralResponsetoBookedCall',
          'PositiveResponse',
          'PositiveResponsetoBookedCall'
        ),
        allowNull: false,
        defaultValue: 'None',
      },
      messageOverview: {
        type: Sequelize.TEXT,
      },
      position: {
        type: Sequelize.STRING,
      },
      liAccount: {
        type: Sequelize.STRING,
      },
      status: {
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
      },
      dateBooked: {
        type: Sequelize.DATE,
      },
      dateOfCall: {
        type: Sequelize.DATE,
      },
      dateTimeOfResponse: {
        type: Sequelize.DATE,
      },
      dateTimeWeResponded: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('leads');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_leads_leadType";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_leads_leadQuality";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_leads_typeOfResponse";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_leads_status";'
    );
  },
};
