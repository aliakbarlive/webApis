'use strict';

const data = [
  {
    cellId: 41,
    name: 'Gina Carla',
    podId: 17,
  },
  {
    cellId: 42,
    name: 'Tammy Ann',
    podId: 18,
  },
  {
    cellId: 43,
    name: 'Joyce',
    podId: 17,
  },
  {
    cellId: 44,
    name: 'Allen Dave',
    podId: 19,
  },
  {
    cellId: 45,
    name: 'Emman Aldwen',
    podId: 18,
  },
  {
    cellId: 46,
    name: ' Krizia ',
    podId: 19,
  },
  {
    cellId: 47,
    name: 'John Adolphus ',
    podId: 20,
  },
  {
    cellId: 48,
    name: 'Jimmy',
    podId: 20,
  },
  {
    cellId: 49,
    name: 'Mark Justine',
    podId: 20,
  },
  {
    cellId: 50,
    name: 'Marvin ',
    podId: 17,
  },
  {
    cellId: 51,
    name: 'Neil Andre ',
    podId: 20,
  },
  {
    cellId: 52,
    name: 'Shem Enjerd ',
    podId: 19,
  },
  {
    cellId: 53,
    name: 'Ritzlie',
    podId: 17,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'cells',
      data.map((el, i) => {
        return {
          ...el,
          type: 'ppc',
          isPpc: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'cells',
      { name: { [Sequelize.Op.in]: data.map((e) => e.name) } },
      {}
    );
  },
};
