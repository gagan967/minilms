const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable] || process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: dbConfig.logging,
    dialectOptions: env === 'production' && dbConfig.dialectOptions ? dbConfig.dialectOptions : {},
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

module.exports = { sequelize, Sequelize };
