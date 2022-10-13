'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'View Advertising data',
      },
      {
        access: 'ppc.view',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Update Campaign Daily Budget (without approval)',
      },
      {
        access: 'ppc.campaign.updateDailyBudget.noApproval',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Update Campaign Daily Budget (with approval)',
      },
      {
        access: 'ppc.campaign.updateDailyBudget.requireApproval',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Apply Campaign Recommended Budget (without approval)',
      },
      {
        access: 'ppc.campaign.applyRecommendedBudget.noApproval',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Apply Campaign Recommended Budget (with approval)',
      },
      {
        access: 'ppc.campaign.applyRecommendedBudget.requireApproval',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'List Optimization Rules',
      },
      {
        access: 'ppc.rule.list',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Create Optimization Rules',
      },
      {
        access: 'ppc.rule.create',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Update Optimization Rules',
      },
      {
        access: 'ppc.rule.update',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'List Change Request',
      },
      {
        access: 'ppc.changeRequest.list',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Evaluate Change Request',
      },
      {
        access: 'ppc.changeRequest.evaluate',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Optimization (without approval)',
      },
      {
        access: 'ppc.optimization.noApproval',
      }
    );

    await queryInterface.bulkUpdate(
      'permissions',
      {
        description: 'Optimization (with approval)',
      },
      {
        access: 'ppc.optimization.requireApproval',
      }
    );
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
            'ppc.view',
            'ppc.campaign.updateDailyBudget.noApproval',
            'ppc.campaign.updateDailyBudget.requireApproval',
            'ppc.campaign.applyRecommendedBudget.noApproval',
            'ppc.campaign.applyRecommendedBudget.requireApproval',
            'ppc.rule.list',
            'ppc.rule.create',
            'ppc.rule.update',
            'ppc.optimization.noApproval',
            'ppc.optimization.requireApproval',
            'ppc.changeRequest.list',
            'ppc.changeRequest.evaluate',
          ],
        },
      }
    );
  },
};
