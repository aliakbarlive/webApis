'use strict';

const data = [
  {
    podId: 17,
    name: 'Neil Garret',
    squadId: 11,
  },
  {
    podId: 18,
    name: 'Nisan Preet',
    squadId: 11,
  },
  {
    podId: 19,
    name: 'Mark',
    squadId: 11,
  },
  {
    podId: 20,
    name: 'Karen PPC',
    squadId: 11,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'pods',
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
      'pods',
      { name: { [Sequelize.Op.in]: data.map((e) => e.name) } },
      {}
    );
  },
};
