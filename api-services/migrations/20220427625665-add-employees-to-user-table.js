'use strict';

const { v4: uuidv4 } = require('uuid');

const employees = [
  {
    firstName: 'Dalaram',
    lastName: 'Alijani',
    email: 'dalaram@sellerinteractive.com',
    roleId: 33,
  },
  {
    firstName: 'Mervin',
    lastName: 'Pangandian',
    email: 'mervin@sellerinteractive.com',
    roleId: 34,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT,
    });
    let emails = users.map((u) => u.email);

    return queryInterface.sequelize.transaction((transaction) => {
      let promises = [];
      for (let i = 0; i < employees.length; i++) {
        if (emails.includes(employees[i].email)) {
          promises.push(
            queryInterface.bulkUpdate(
              'users',
              {
                firstName: employees[i].firstName.trim(),
                lastName: employees[i].lastName.trim(),
                roleId: employees[i].roleId,
              },
              {
                email: employees[i].email.trim(),
              },
              { transaction }
            )
          );
        } else {
          promises.push(
            queryInterface.bulkInsert(
              'users',
              [
                {
                  firstName: employees[i].firstName.trim(),
                  lastName: employees[i].lastName.trim(),
                  email: employees[i].email.trim(),
                  roleId: employees[i].roleId,
                  userId: uuidv4(),
                  password:
                    '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
                  isEmailVerified: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              { transaction }
            )
          );
        }
      }
      return Promise.all(promises);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'users',
      { email: { [Sequelize.Op.in]: employees.map((e) => e.email) } },
      {}
    );
  },
};
