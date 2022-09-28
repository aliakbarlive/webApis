'use strict';

const data = [
  {
    name: 'Antonette',
    isPpc: false,
    departmentId: 1,
    type: 'operations',
    squadId: 7,
  },
  {
    name: 'Jenette',
    isPpc: false,
    departmentId: 1,
    type: 'operations',
    squadId: 8,
  },
  {
    name: 'Karen ',
    isPpc: false,
    departmentId: 1,
    type: 'operations',
    squadId: 9,
  },
  {
    name: 'Mohamed',
    isPpc: false,
    departmentId: 1,
    type: 'operations',
    squadId: 10,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'squads',
      data.map((el, i) => {
        return {
          ...el,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'squads',
      { name: { [Sequelize.Op.in]: data.map((e) => e.name) } },
      {}
    );
  },
};
