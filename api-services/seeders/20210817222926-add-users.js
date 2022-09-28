'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          userId: '64b16599-fb20-4130-8eb3-051272a51acb',
          roleId: 1,
          firstName: 'Ashtonbee',
          lastName: 'Baby',
          email: 'ashtonbee@betterseller.com',
          password:
            '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
          resetPasswordToken: null,
          resetPasswordExpire: null,
          isEmailVerified: 'True',
          verifyEmailToken: null,
          verifyEmailExpire: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: '4675d995-54f4-41b2-9c9c-e42b79654fbe',
          roleId: 3,
          firstName: 'Super',
          lastName: 'User',
          email: 'appsu@betterseller.com',
          password:
            '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
          resetPasswordToken: null,
          resetPasswordExpire: null,
          isEmailVerified: 'True',
          verifyEmailToken: null,
          verifyEmailExpire: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'c8dd2253-9bd6-43c6-86e8-c006435c1b3b',
          roleId: 4,
          firstName: 'Super',
          lastName: 'User',
          email: 'agencysu@betterseller.com',
          password:
            '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
          resetPasswordToken: null,
          resetPasswordExpire: null,
          isEmailVerified: 'True',
          verifyEmailToken: null,
          verifyEmailExpire: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
