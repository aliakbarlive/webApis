'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('commissions', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'accounts',
          schema: 'public',
        },
        key: 'accountId',
      },
    });

    // populate accountId field
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const commissions = await queryInterface.sequelize.query(
        'SELECT * FROM commissions',
        { type: Sequelize.QueryTypes.SELECT }
      );

      for await (const commission of commissions) {
        const subscription = await queryInterface.sequelize.query(
          'SELECT * FROM subscriptions where "subscriptionId" = ?',
          {
            plain: true,
            replacements: [commission.subscriptionId],
          }
        );

        await queryInterface.sequelize.query(
          'UPDATE commissions SET "accountId" = ? WHERE "subscriptionId" = ?',
          {
            replacements: [subscription.accountId, commission.subscriptionId],
            transaction,
          }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Something went wrong: ', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('commissions', 'accountId');
  },
};
