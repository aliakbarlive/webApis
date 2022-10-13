'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('agencyClients', {
      agencyClientId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      accountId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      siEmail: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,
      },
      client: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      website: {
        type: Sequelize.STRING,
      },
      aboutUs: {
        type: Sequelize.TEXT,
      },
      overview: {
        type: Sequelize.TEXT,
      },
      painPoints: {
        type: Sequelize.TEXT,
      },
      goals: {
        type: Sequelize.TEXT,
      },
      productCategories: {
        type: Sequelize.TEXT,
      },
      amazonPageUrl: {
        type: Sequelize.TEXT,
      },
      asinsToOptimize: {
        type: Sequelize.TEXT,
      },
      otherNotes: {
        type: Sequelize.TEXT,
      },
      defaultContactId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
      },
      hostedpageDetails: {
        type: Sequelize.JSONB,
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('agencyClients');
  },
};
