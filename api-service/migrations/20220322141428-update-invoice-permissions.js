'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'invoices',
        access: 'invoices.commissionerror.view',
        description: 'Commission Errors view',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'invoices',
        access: 'invoices.commissionerror.resolve',
        description: 'Commission Errors Resolve',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('permissions', permissions, { transaction }),

        queryInterface.bulkDelete(
          'permissions',
          {
            access: 'invoices.pdf.print',
          },
          { transaction }
        ),

        queryInterface.bulkDelete(
          'permissions',
          {
            access: 'invoices.lineitem.commission.delete',
          },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          {
            description: 'Invoices Pdf Preview/Print',
          },
          { access: 'invoices.pdf.preview' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          {
            access: 'invoices.history.view',
          },
          { access: 'invoices.invoices.view' },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
