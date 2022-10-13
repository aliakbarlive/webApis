'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" ALTER COLUMN "accountManager" TYPE UUID USING "accountManager"::UUID;',
          { transaction: t }
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" ALTER COLUMN "seniorAccountManager" TYPE UUID USING "seniorAccountManager"::UUID;',
          { transaction: t }
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" RENAME COLUMN "accountManager" TO "accountManagerId";',
          { transaction: t }
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" RENAME COLUMN "seniorAccountManager" TO "seniorAccountManagerId";',
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" RENAME COLUMN "accountManagerId" TO "accountManager";',
          { transaction: t }
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" RENAME COLUMN "seniorAccountManagerId" TO "seniorAccountManager";',
          { transaction: t }
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" ALTER COLUMN "accountManager" TYPE varchar(255)',
          { transaction: t }
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "terminations" ALTER COLUMN "seniorAccountManager" TYPE varchar(255)',
          { transaction: t }
        ),
      ]);
    });
  },
};
