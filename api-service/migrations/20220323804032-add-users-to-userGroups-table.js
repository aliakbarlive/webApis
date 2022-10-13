'use strict';

const data = [
  {
    departmentId: 1,
    squadId: 7,
    podId: null,
    cellId: null,
    firstName: 'Antonette',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: null,
    cellId: null,
    firstName: 'Jenette',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 9,
    podId: null,
    cellId: null,
    firstName: 'Karen ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: null,
    cellId: null,
    firstName: 'Mohamed',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: '8',
    cellId: null,
    firstName: 'Shuokai',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: '9',
    cellId: null,
    firstName: 'Michella',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: '10',
    cellId: null,
    firstName: 'Hannah Clementine',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '11',
    cellId: null,
    firstName: 'Floridel',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '12',
    cellId: null,
    firstName: 'Desiree',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '13',
    cellId: null,
    firstName: 'Katerine',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '14',
    cellId: null,
    firstName: 'Daisylyn',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '15',
    cellId: null,
    firstName: 'Maria Carla Ellaine',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '16',
    cellId: null,
    firstName: 'Hamza',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: '9',
    cellId: '20',
    firstName: 'Jonathan',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '11',
    cellId: '21',
    firstName: 'Bell Riche ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '12',
    cellId: '22',
    firstName: 'Louise',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: '13',
    cellId: '23',
    firstName: 'John Russel ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT,
    });

    await queryInterface.bulkInsert(
      'userGroup',
      data.map((el) => {
        return {
          departmentId: el.departmentId,
          squadId: el.squadId,
          podId: el.podId,
          cellId: el.cellId,
          userId: users.find(
            (user) =>
              user.password === el.password &&
              user.firstName === el.firstName.trim()
          ).userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const usersIds = data
      .map((el) => {
        return {
          ...el,
          userId: users.find(
            (user) =>
              user.password === el.password &&
              user.firstName === el.firstName.trim()
          )
            ? users.find(
                (user) =>
                  user.password === el.password &&
                  user.firstName === el.firstName.trim()
              ).userId
            : '998bf960-7e20-4f4b-a2d4-ca1b72a62db7', // not include in users (dummy uuid)
        };
      })
      .map((e) => e.userId);

    await queryInterface.bulkDelete(
      'userGroup',
      {
        userId: {
          [Sequelize.Op.in]: usersIds,
        },
      },
      {}
    );
  },
};
