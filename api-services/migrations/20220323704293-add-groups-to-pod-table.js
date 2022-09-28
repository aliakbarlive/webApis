'use strict';

const data = [
  {
    podId: 8,
    name: 'Shuokai',
    squadId: 8,
  },
  {
    podId: 9,
    name: 'Michella',
    squadId: 8,
  },
  {
    podId: 10,
    name: 'Hannah Clementine',
    squadId: 8,
  },
  {
    podId: 11,
    name: 'Floridel',
    squadId: 10,
  },
  {
    podId: 12,
    name: 'Desiree',
    squadId: 10,
  },
  {
    podId: 13,
    name: 'Katerine',
    squadId: 10,
  },
  {
    podId: 14,
    name: 'Daisylyn',
    squadId: 10,
  },
  {
    podId: 15,
    name: 'Maria Carla Ellaine',
    squadId: 10,
  },
  {
    podId: 16,
    name: 'Hamza',
    squadId: 10,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'pods',
      data.map((el, i) => {
        return {
          ...el,
          type: 'operations',
          isPpc: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'pods',
      { name: { [Sequelize.Op.in]: data.map((e) => e.name) } },
      {}
    );
  },
};
