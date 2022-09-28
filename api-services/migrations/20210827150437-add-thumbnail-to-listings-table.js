'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('listings', 'thumbnail', {
      type: Sequelize.TEXT,
      defaultValue:
        'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif',
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('listings', 'thumbnail');
  },
};
