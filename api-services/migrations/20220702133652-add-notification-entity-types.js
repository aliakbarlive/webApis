'use strict';

const entityTypes = [
  {
    entity: 'clients',
    i18nAttribute: 'client.subscription',
    description: 'new client subscription',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    entity: 'clients',
    i18nAttribute: 'client.subscription.failed',
    description: 'new client subscription failed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    entity: 'terminations',
    i18nAttribute: 'termination.filed',
    description: 'file termination form for a client',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert('notificationEntityTypes', entityTypes, {
        ignoreDuplicates: true,
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
