'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.upload.unassignedLeads',
        description: 'Upload unassigned leads csv',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.mark.duplicate',
        description: 'Mark leads as duplicate',
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
          { access: 'leads.upload.unassignedLeads' },
          { access: 'leads.mark.duplicate' },
          { transaction }
        ),
      ]);
    });
  },
};
