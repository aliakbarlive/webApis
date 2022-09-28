'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const leadVariables = [
      {
        key: 'highCalendlyUrl',
        value:
          'https://calendly.com/d/cq9-kbq-xfh/intro-call-amazon-zoom-meeting-h',
        description: 'Lead Quality = high\nAsin Earnings = $50k-$150k',
        createdAt: new Date(),
        updatedAt: new Date(),
        leadVariableId: uuidv4(),
      },
      {
        key: 'mediumCalendlyUrl',
        value:
          'https://calendly.com/d/drb-t6y-6m4/intro-call-amazon-zoom-meeting-m',
        description: 'Lead Quality = medium\nAsin Earnings = $10k-$50k',
        createdAt: new Date(),
        updatedAt: new Date(),
        leadVariableId: uuidv4(),
      },
      {
        key: 'lowCalendlyUrl',
        value:
          'https://calendly.com/d/gjtv-t4kx/intro-call-amazon-zoom-meeting-w-seller-interactive',
        description: 'Lead Quality = low\nAsin Earnings = $0 - $10,000',
        createdAt: new Date(),
        updatedAt: new Date(),
        leadVariableId: uuidv4(),
      },
      {
        key: 'ultraHighCalendlyUrl',
        value:
          'https://calendly.com/d/dh7-62g-bmq/intro-call-amazon-zoom-meeting-uh',
        description: 'Lead Quality = ultra high\nAsin Earnings = $150k+',
        createdAt: new Date(),
        updatedAt: new Date(),
        leadVariableId: uuidv4(),
      },
      {
        key: 'leadMarketPlace',
        value: '.com\n.ca\n.uk',
        description: 'Available marketplace in leads form',
        createdAt: new Date(),
        updatedAt: new Date(),
        leadVariableId: uuidv4(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('leadVariables', leadVariables, {
          transaction,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'leadVariables',
          { key: 'highCalendlyUrl' },
          { key: 'mediumCalendlyUrl' },
          { key: 'lowCalendlyUrl' },
          { key: 'ultraHighCalendlyUrl' },
          { key: 'leadMarketPlace' },
          { transaction }
        ),
      ]);
    });
  },
};
