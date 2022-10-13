const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
