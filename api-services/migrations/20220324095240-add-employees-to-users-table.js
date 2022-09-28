'use strict';

const { v4: uuidv4 } = require('uuid');

const employees = [
  {
    firstName: 'Jan Ryan',
    lastName: 'Palioto',
    email: 'jan.palioto@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Keaby Ghing ',
    lastName: 'Delacion',
    email: 'keaby.delacion@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Donnalyn',
    lastName: 'Soliven',
    email: 'donnalyn.soliven@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Fernando',
    lastName: 'Magallanes Jr.',
    email: 'fernando.magallanes@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Dona Liza',
    lastName: 'Tuazon',
    email: 'dona.tuazon@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Sitti Sheiba',
    lastName: 'Cassan',
    email: 'sitti.cassan@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Mary Jane ',
    lastName: 'Serrano',
    email: 'mary.serrano@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'John Rey',
    lastName: 'Ferrer',
    email: 'john.ferrer@sellerinteractive.com',
    roleId: 14,
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
