'use strict';

const data = [
  {
    departmentId: 1,
    squadId: 8,
    podId: 9,
    cellId: 24,
    firstName: 'Jan Ryan',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 14,
    cellId: 25,
    firstName: 'Keaby Ghing ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 15,
    cellId: 26,
    firstName: 'Maria Clarissa ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 13,
    cellId: 27,
    firstName: 'Mark Francis',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: 9,
    cellId: 28,
    firstName: 'Kristal Lynn ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: 10,
    cellId: 29,
    firstName: 'Aisne',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 11,
    cellId: 30,
    firstName: 'Fernando',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 12,
    cellId: 31,
    firstName: 'Jake',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 11,
    cellId: 32,
    firstName: 'Sitti Sheiba',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: 10,
    cellId: 33,
    firstName: 'Camille Joy',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 15,
    cellId: 34,
    firstName: ' Irene',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 15,
    cellId: 35,
    firstName: 'Mary Jane ',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: 9,
    cellId: 36,
    firstName: 'John Rey',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 11,
    cellId: 37,
    firstName: 'Samuel Reu',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 8,
    podId: 10,
    cellId: 38,
    firstName: 'Lailani',
    password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
  },
  {
    departmentId: 1,
    squadId: 10,
    podId: 12,
    cellId: 39,
    firstName: 'Ruby Ann',
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
