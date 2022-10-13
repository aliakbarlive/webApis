'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const departments = [
      {
        departmentId: 1,
        name: 'department1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const squads = [
      {
        squadId: 1,
        name: 'squad1',
        isPpc: false,
        departmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        squadId: 2,
        name: 'squadPpd',
        isPpc: true,
        departmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const pods = [
      {
        podId: 1,
        name: 'pod1',
        isPpc: false,
        squadId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        podId: 2,
        name: 'podPpc',
        isPpc: true,
        squadId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cells = [
      {
        cellId: 1,
        name: 'cell1',
        isPpc: false,
        podId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cellId: 2,
        name: 'cellPpc',
        isPpc: true,
        podId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('agencyClients', 'cellId', {
          type: Sequelize.INTEGER,
        }),
        queryInterface.bulkInsert('department', departments, { transaction }),
        queryInterface.bulkInsert('squads', squads, { transaction }),
        queryInterface.bulkInsert('pods', pods, { transaction }),
        queryInterface.bulkInsert('cells', cells, { transaction }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('agencyClients', 'cellId');
  },
};
