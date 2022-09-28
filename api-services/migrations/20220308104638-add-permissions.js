'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'ppc',
        access: 'ppc.view',
      },
      {
        feature: 'ppc',
        access: 'ppc.campaign.updateDailyBudget.noApproval',
      },
      {
        feature: 'ppc',
        access: 'ppc.campaign.updateDailyBudget.requireApproval',
      },
      {
        feature: 'ppc',
        access: 'ppc.campaign.applyRecommendedBudget.noApproval',
      },
      {
        feature: 'ppc',
        access: 'ppc.campaign.applyRecommendedBudget.requireApproval',
      },
      {
        feature: 'ppc',
        access: 'ppc.rule.list',
      },
      {
        feature: 'ppc',
        access: 'ppc.rule.create',
      },
      {
        feature: 'ppc',
        access: 'ppc.rule.update',
      },
      {
        feature: 'ppc',
        access: 'ppc.optimization.noApproval',
      },
      {
        feature: 'ppc',
        access: 'ppc.optimization.requireApproval',
      },
      {
        feature: 'ppc',
        access: 'ppc.changeRequest.list',
      },
      {
        feature: 'ppc',
        access: 'ppc.changeRequest.evaluate',
      },
      {
        feature: 'profits',
        access: 'profits.view',
      },
      {
        feature: 'products',
        access: 'products.view',
      },
      {
        feature: 'orders',
        access: 'orders.view',
      },
      {
        feature: 'reviews',
        access: 'reviews.view',
      },
      {
        feature: 'alerts',
        access: 'alerts.view',
      },
      {
        feature: 'creditNotes',
        access: 'creditNotes.request',
      },
      {
        feature: 'creditNotes',
        access: 'creditNotes.approve',
      },
      {
        feature: 'creditNotes',
        access: 'creditNotes.list',
      },
      {
        feature: 'clients',
        access: 'clients.view.all',
      },
      {
        feature: 'clients',
        access: 'clients.view.filtered',
      },
      {
        feature: 'clients',
        access: 'clients.add',
      },
      {
        feature: 'clients',
        access: 'clients.edit',
      },
      {
        feature: 'clients',
        access: 'clients.profile.view',
      },
      {
        feature: 'clients',
        access: 'clients.profile.edit',
      },
      {
        feature: 'clients',
        access: 'clients.commission.create',
      },
      {
        feature: 'clients',
        access: 'clients.commission.update',
      },
      {
        feature: 'clients',
        access: 'clients.commission.delete',
      },
      {
        feature: 'clients',
        access: 'clients.termination.create',
      },
      {
        feature: 'clients',
        access: 'clients.termination.update',
      },
      {
        feature: 'clients',
        access: 'clients.termination.delete',
      },
      {
        feature: 'clients',
        access: 'clients.termination.view',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.view',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.update',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.card.add',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.card.update',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.addon.add',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.pause',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.billing.update',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.note.add',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.note.delete',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.description.update',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.adminfee.update',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.invoices.view',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.activities.view',
      },
      {
        feature: 'clients',
        access: 'clients.subscription.onboarding',
      },
      {
        feature: 'clients',
        access: 'clients.assignToCell',
      },
      {
        feature: 'employees',
        access: 'employees.list',
      },
      {
        feature: 'employees',
        access: 'employees.orgChart.view',
      },
      {
        feature: 'employees',
        access: 'employees.create',
      },
      {
        feature: 'employees',
        access: 'employees.manage',
      },
      {
        feature: 'employees',
        access: 'employees.invites.resend',
      },
      {
        feature: 'invoices',
        access: 'invoices.view',
      },
      {
        feature: 'invoices',
        access: 'invoices.email.bulk',
      },
      {
        feature: 'invoices',
        access: 'invoices.collect.bulk',
      },
      {
        feature: 'invoices',
        access: 'invoices.details.view',
      },
      {
        feature: 'invoices',
        access: 'invoices.email',
      },
      {
        feature: 'invoices',
        access: 'invoices.pdf.preview',
      },
      {
        feature: 'invoices',
        access: 'invoices.pdf.print',
      },
      {
        feature: 'invoices',
        access: 'invoices.pdf.download',
      },
      {
        feature: 'invoices',
        access: 'invoices.collect',
      },
      {
        feature: 'invoices',
        access: 'invoices.payment.add',
      },
      {
        feature: 'invoices',
        access: 'invoices.invoices.view',
      },
      {
        feature: 'invoices',
        access: 'invoices.lineitem.add',
      },
      {
        feature: 'invoices',
        access: 'invoices.lineitem.delete',
      },
      {
        feature: 'invoices',
        access: 'invoices.lineitem.commission.add',
      },
      {
        feature: 'invoices',
        access: 'invoices.lineitem.commission.delete',
      },
      {
        feature: 'invoices',
        access: 'invoices.queue.email',
      },
      {
        feature: 'invoices',
        access: 'invoices.queue.collect',
      },
      {
        feature: 'invoices',
        access: 'invoices.payments.view',
      },
      {
        feature: 'invoices',
        access: 'invoices.events.view',
      },
      {
        feature: 'churn',
        access: 'churn.view',
      },
      {
        feature: 'churn',
        access: 'churn.terminations.view',
      },
      {
        feature: 'churn',
        access: 'churn.terminations.update',
      },
    ];

    await queryInterface.bulkInsert(
      'permissions',
      permissions.map((permission) => {
        return {
          ...permission,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
