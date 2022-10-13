'use strict';

const data = [
  {
    name: 'Dummy Ppc Head',
    isPpc: false,
    departmentId: 1,
    type: 'ppc',
    squadId: 11,
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
