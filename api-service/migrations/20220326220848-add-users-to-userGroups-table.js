'use strict';

const data = [
  {
    departmentId: 1,
    squadId: 11,
    podId: null,
    cellId: null,
    firstName: 'Dummy Ppc Head',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '17',
    cellId: null,
    firstName: 'Neil Garret',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '18',
    cellId: null,
    firstName: 'Nisan Preet',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '19',
    cellId: null,
    firstName: 'Mark',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '20',
    cellId: null,
    firstName: 'Karen PPC',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '17',
    cellId: '41',
    firstName: 'Gina Carla',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '18',
    cellId: '42',
    firstName: 'Tammy Ann',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '17',
    cellId: '43',
    firstName: 'Joyce',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '19',
    cellId: '44',
    firstName: 'Allen Dave',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '18',
    cellId: '45',
    firstName: 'Emman Aldwen',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '19',
    cellId: '46',
    firstName: ' Krizia ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '20',
    cellId: '47',
    firstName: 'John Adolphus ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '20',
    cellId: '48',
    firstName: 'Jimmy',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '20',
    cellId: '49',
    firstName: 'Mark Justine',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '17',
    cellId: '50',
    firstName: 'Marvin ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '20',
    cellId: '51',
    firstName: 'Neil Andre ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '19',
    cellId: '52',
    firstName: 'Shem Enjerd ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 11,
    podId: '17',
    cellId: '53',
    firstName: 'Ritzlie',
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
