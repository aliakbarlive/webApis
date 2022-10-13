'use strict';

const data = [
  {
    cellId: 20,
    name: 'Jonathan',
    podId: 9,
  },
  {
    cellId: 21,
    name: 'Bell Riche ',
    podId: 11,
  },
  {
    cellId: 22,
    name: 'Louise',
    podId: 12,
  },
  {
    cellId: 23,
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
