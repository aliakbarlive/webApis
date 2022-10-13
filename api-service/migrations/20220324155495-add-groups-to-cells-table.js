'use strict';

const data = [
  {
    cellId: 24,
    name: 'Jan Ryan',
    podId: 9,
  },
  {
    cellId: 25,
    name: 'Keaby Ghing ',
    podId: 14,
  },
  {
    cellId: 26,
    name: 'Maria Clarissa ',
    podId: 15,
  },
  {
    cellId: 27,
    name: 'Mark Francis',
    podId: 13,
  },
  {
    cellId: 28,
    name: 'Kristal Lynn ',
    podId: 9,
  },
  {
    cellId: 29,
    name: 'Aisne',
    podId: 10,
  },
  {
    cellId: 30,
    name: 'Fernando',
    podId: 11,
  },
  {
    cellId: 31,
    name: 'Jake',
    podId: 12,
  },
  {
    cellId: 32,
    name: 'Sitti Sheiba',
    podId: 11,
  },
  {
    cellId: 33,
    name: 'Camille Joy',
    podId: 10,
  },
  {
    cellId: 34,
    name: ' Irene',
    podId: 15,
  },
  {
    cellId: 35,
    name: 'Mary Jane ',
    podId: 15,
  },
  {
    cellId: 36,
    name: 'John Rey',
    podId: 9,
  },
  {
    cellId: 37,
    name: 'Samuel Reu',
    podId: 11,
  },
  {
    cellId: 38,
    name: 'Lailani',
    podId: 10,
  },
  {
    cellId: 39,
    name: 'Ruby Ann',
    podId: 12,
  },
  {
    cellId: 40,
    name: 'John Russel ',
    podId: 13,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'cells',
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
      'cells',
      { name: { [Sequelize.Op.in]: data.map((e) => e.name) } },
      {}
    );
  },
};
