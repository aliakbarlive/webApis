'use strict';
const { Model } = require('sequelize');
const User = require('./user');
const Pod = require('./pod');
const LinkedInAccount = require('./linkedInAccount');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate({
      User,
      LeadNote,
      Pod,
      LinkedInAccount,
      LeadConversation,
      LeadSource,
    }) {
      this.belongsTo(User, {
        foreignKey: 'clientCreatedBy',
        as: 'clientCreatedByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'leadsRep',
        as: 'addedBy',
      });
      this.belongsTo(User, {
        foreignKey: 'salesRep',
        as: 'requestedByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'processedBy',
        as: 'processedByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'pitcher',
        as: 'pitchedByUser',
      });
      this.belongsTo(LinkedInAccount, {
        foreignKey: 'linkedInAccountId',
        as: 'liAccountUsed',
      });
      this.hasMany(LeadNote, {
        foreignKey: 'leadId',
        as: 'leadNotes',
      });
      this.hasMany(LeadConversation, {
        foreignKey: 'leadId',
        as: 'leadConversation',
      });
      this.belongsTo(Pod, {
        foreignKey: 'podId',
        as: 'pod',
      });
      this.belongsTo(LeadSource, {
        foreignKey: 'leadSourceId',
        as: 'leadSource',
      });
    }
  }
  Lead.init(
    {
      leadId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sentFromAcct: DataTypes.STRING,
      lead: DataTypes.STRING,
      title: DataTypes.STRING,
      companyName: DataTypes.STRING,
      companyLI: DataTypes.TEXT,
      website: DataTypes.STRING,
      leadType: DataTypes.STRING,
      country: DataTypes.STRING,
      leadQuality: DataTypes.STRING,
      amzStoreFBAstoreFront: DataTypes.STRING,
      leadScreenShotURL: DataTypes.TEXT,
      competitorScreenShotURL: DataTypes.TEXT,
      linkedInProfileURL: DataTypes.TEXT,
      leadPhotoURL: DataTypes.TEXT,
      remarks: DataTypes.TEXT,
      salesRep: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      leadsRep: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      pitcher: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      leadGenRepName: DataTypes.STRING,
      processedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      clientCreatedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      typeOfResponse: {
        type: DataTypes.ENUM(
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
      messageOverview: DataTypes.TEXT,
      position: DataTypes.STRING,
      liAccount: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Unprocessed New Leads',
      },
      dateBooked: DataTypes.DATE,
      dateOfCall: DataTypes.DATE,
      dateTimeOfResponse: DataTypes.DATE,
      dateTimeWeResponded: DataTypes.DATE,
      pitchDate: DataTypes.DATE,
      pitchedDate: DataTypes.DATE,
      competitorBrandName: DataTypes.STRING,
      currentEarnings: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      revenue: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      competitorSalesUnits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      source: DataTypes.TEXT,
      amazonProduct: DataTypes.TEXT,
      majorKeywordSearchPage: DataTypes.TEXT,
      competitorsProduct: DataTypes.TEXT,
      competitorsWebsite: DataTypes.TEXT,
      spokeTo: DataTypes.STRING,
      personsResponsible: DataTypes.TEXT,
      mainObjectivePainPoints: DataTypes.TEXT,
      otherSalesChannels: DataTypes.TEXT,
      ppcSpend: DataTypes.STRING,
      avgACOS: DataTypes.STRING,
      quote: DataTypes.TEXT,
      firstCallSummary: DataTypes.TEXT,
      serviceConditionsForOP: DataTypes.TEXT,
      email: DataTypes.STRING,
      otherEmails: DataTypes.STRING,
      mockListing: DataTypes.TEXT,
      ownersFullName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      aboutUs: DataTypes.TEXT,
      qualifiedFromLIAccount: DataTypes.STRING,
      qualifiedBy: DataTypes.STRING,
      totalOfASINSAndVariations: DataTypes.STRING,
      callRecording: DataTypes.TEXT,
      productCategory: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      paymentType: DataTypes.STRING,
      plan: DataTypes.STRING,
      stage: DataTypes.STRING,
      averageMonthlyAmazonSales: DataTypes.STRING,
      averageMonthlyOutsideAmazonSales: DataTypes.STRING,
      mainIssueWithAmazon: DataTypes.STRING,
      podId: {
        type: DataTypes.INTEGER,
        references: {
          model: Pod,
          key: 'podId',
        },
      },
      marketplace: DataTypes.STRING,
      storeFrontEarnings: DataTypes.DECIMAL,
      rejectionReasons: DataTypes.STRING,
      competitorsProduct2: DataTypes.STRING,
      address: DataTypes.STRING,
      companyAverageMonthlyRevenue: DataTypes.STRING,
      callRecording2: DataTypes.STRING,
      callAppointmentDate1: DataTypes.DATE,
      callAppointmentDate2: DataTypes.DATE,
      callAppointmentDate3: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      linkedInAccountId: {
        type: DataTypes.UUID,
        references: {
          model: LinkedInAccount,
          key: 'linkedInAccountId',
        },
      },
      linkedinContact: DataTypes.STRING,
      decisionMakersEmail: DataTypes.STRING,
      instagram: DataTypes.STRING,
      facebook: DataTypes.STRING,
      subCategory1: DataTypes.STRING,
      subCategory2: DataTypes.STRING,
      channelPartnerType: DataTypes.STRING,
      asinMajorKeyword: DataTypes.STRING,
      asinFullTitle: DataTypes.TEXT,
      asinRevenueScreenshot: DataTypes.TEXT,
      competitorAsinRevenueScreenshot: DataTypes.TEXT,
      asinRevenueScreenshotDateStamp: DataTypes.DATE,
      competitorAsinRevenueScreenshotDateStamp: DataTypes.DATE,
      brandName: DataTypes.STRING,
      asinPrice: DataTypes.STRING,
      asinReviews: DataTypes.STRING,
      revisionText: DataTypes.STRING,
      leadLastName: DataTypes.STRING,
      asin: DataTypes.STRING,
      totalRevenue: DataTypes.STRING,
      secondaryLeadFirstName: DataTypes.STRING,
      secondaryLeadLastName: DataTypes.STRING,
      secondaryPhoneNumber: DataTypes.STRING,
      secondaryEmailAddress: DataTypes.STRING,

      approvedDate: DataTypes.DATE,
      revisionDate: DataTypes.DATE,
      rejectedDate: DataTypes.DATE,
      dateOfCallScreenshot: DataTypes.TEXT,
      responseDateCallScreenshot: DataTypes.TEXT,
      isFromOldLeads: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isInSales: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      leadSourceId: DataTypes.BIGINT,
      prevStatus: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'leads',
      modelName: 'Lead',
    }
  );
  return Lead;
};
