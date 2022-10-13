'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('commissions', 'subscriptionId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('commissions', 'subscriptionId', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'subscriptions',
          schema: 'public',
        },
        key: 'subscriptionId',
      },
    });

    //re-populate subscriptionId field
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const commissions = await queryInterface.sequelize.query(
        'SELECT * FROM commissions',
        { type: Sequelize.QueryTypes.SELECT }
      );

      for await (const commission of commissions) {
        const subscription = await queryInterface.sequelize.query(
          'SELECT * FROM subscriptions where "accountId" = ?',
          {
            plain: true,
            replacements: [commission.accountId],
          }
        );

        await queryInterface.sequelize.query(
          'UPDATE commissions SET "subscriptionId" = ? WHERE "accountId" = ?',
          {
            replacements: [subscription.subscriptionId, commission.accountId],
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
};
