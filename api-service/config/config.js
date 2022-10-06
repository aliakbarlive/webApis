require('dotenv').config();

module.exports = {
  development: {
    database: 'postgres',
    username: 'postgres',
    password: 'postgres_password',
    dialect: 'postgres',
    logging: false,
    replication: {
      read: {
        host: 'postgres',
      },
      write: {
        host: 'postgres',
      },
    },
    pool: {
      max: 20,
      min: 1,
      acquire: 120000,
      idle: 20000,
    },
  },
  staging: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 120000,
      idle: 20000,
    },
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 40,
      min: 0,
      acquire: 120000,
      idle: 20000,
    },
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    pool: {
      max: 80,
      min: 0,
      acquire: 120000,
      idle: 20000,
    },
  },
};
