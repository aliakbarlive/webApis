'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          { access: 'clients.view.filtered' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'View List of Clients' },
          { access: 'clients.view.all' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Add Client' },
          { access: 'clients.add' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Edit Client' },
          { access: 'clients.edit' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Add Commission Rate' },
          { access: 'clients.commission.create' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Edit Commission Rate' },
          { access: 'clients.commission.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Delete Commission Rate' },
          { access: 'clients.commission.delete' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Create Termination Request' },
          { access: 'clients.termination.create' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Edit Termination Request' },
          { access: 'clients.termination.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Delete Termination Request' },
          { access: 'clients.termination.delete' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'View Termination Request' },
          { access: 'clients.termination.view' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'View Subscription' },
          { access: 'clients.subscription.view' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Edit Subscription' },
          { access: 'clients.subscription.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Add Card Details' },
          { access: 'clients.subscription.card.add' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Update Card Details' },
          { access: 'clients.subscription.card.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Add One-Time Addon' },
          { access: 'clients.subscription.addon.add' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Pause Subscription' },
          { access: 'clients.subscription.pause' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Change Billing Date' },
          { access: 'clients.subscription.billing.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Add Subscription Note' },
          { access: 'clients.subscription.note.add' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Delete Subscription Note' },
          { access: 'clients.subscription.note.delete' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Update Subscription description' },
          { access: 'clients.subscription.description.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Toggle charge 3% admin fee for offline clients' },
          { access: 'clients.subscription.adminfee.update' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'View Subscription Invoice History' },
          { access: 'clients.subscription.invoices.view' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'View Subscription Recent Activities' },
          { access: 'clients.subscription.activities.view' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Onboarding' },
          { access: 'clients.subscription.onboarding' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Assigning into cell' },
          { access: 'clients.assignToCell' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'View Client Profile' },
          { access: 'clients.profile.view' },
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'permissions',
          { description: 'Edit Client Profile' },
          { access: 'clients.profile.edit' },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: null,
      },
      {
        access: {
          [Sequelize.Op.in]: [
            'clients.view.all',
            'clients.add',
            'clients.edit',
            'clients.commission.create',
            'clients.commission.update',
            'clients.commission.delete',
            'clients.termination.create',
            'clients.termination.update',
            'clients.termination.delete',
            'clients.termination.view',
            'clients.subscription.view',
            'clients.subscription.update',
            'clients.subscription.card.add',
            'clients.subscription.card.update',
            'clients.subscription.addon.add',
            'clients.subscription.pause',
            'clients.subscription.billing.update',
            'clients.subscription.note.add',
            'clients.subscription.note.delete',
            'clients.subscription.description.update',
            'clients.subscription.adminfee.update',
            'clients.subscription.invoices.view',
            'clients.subscription.activities.view',
            'clients.subscription.onboarding',
            'clients.assignToCell',
            'clients.profile.view',
            'clients.profile.edit',
          ],
        },
      }
    );
  },
};
