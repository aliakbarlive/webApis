'use strict';

const { v4: uuidv4 } = require('uuid');

const employees = [
  {
    firstName: 'Akshatha',
    lastName: '',
    email: 'akshatha@sellerinteractive.com',
    roleId: 17,
    trainingDate: '2022-05-27',
  },
  {
    firstName: 'Clowee',
    lastName: 'Vergara',
    email: 'clowee.vergara@sellerinteractive.com',
    roleId: 18,
    trainingDate: '2022-05-27',
  },
  {
    firstName: 'Nheca Marie',
    lastName: 'Aguila',
    email: 'nheca.aguila@sellerinteractive.com',
    roleId: 19,
    trainingDate: '2022-05-27',
  },
  {
    firstName: 'Rommel',
    lastName: 'Avila',
    email: 'rommel.avila@sellerinteractive.com',
    roleId: 19,
    trainingDate: '2022-05-27',
  },
  {
    firstName: 'Jerico',
    lastName: 'Cruz',
    email: 'jerico.cruz@sellerinteractive.com',
    roleId: 18,
    trainingDate: '2022-05-27',
  },
  {
    firstName: 'Denmark',
    lastName: 'Guimbarda',
    email: 'denmark.guimbarda@sellerinteractive.com',
    roleId: 18,
    trainingDate: '2022-05-27',
  },
  {
    firstName: 'Leslie',
    lastName: 'Domingo',
    email: 'leslie.domingo@sellerinteractive.com',
    roleId: 19,
    trainingDate: '2022-05-27',
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
                trainingDate: employees[i].trainingDate,
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
                  trainingDate: employees[i].trainingDate,
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
