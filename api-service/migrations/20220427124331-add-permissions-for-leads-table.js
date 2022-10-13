'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.list',
        description: 'View List of Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.view',
        description: 'View Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.create',
        description: 'Create Leads',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.update',
        description: 'Update Lead',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.delete',
        description: 'Delete Lead',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.approve',
        description: 'Approve Lead',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.notes.list',
        description: 'View List of Lead Notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.notes.view',
        description: 'View Lead Notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.notes.create',
        description: 'Create Lead Note',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.notes.delete',
        description: 'Delete Lead Note',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('permissions', permissions, { transaction }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          { access: 'leads.list' },
          { access: 'leads.view' },
          { access: 'leads.create' },
          { access: 'leads.update' },
          { access: 'leads.delete' },
          { access: 'leads.approve' },
          { access: 'leads.notes.list' },
          { access: 'leads.notes.view' },
          { access: 'leads.notes.create' },
          { access: 'leads.notes.delete' },
          { transaction }
        ),
      ]);
    });
  },
};
