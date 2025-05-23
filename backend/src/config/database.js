const { Sequelize } = require('sequelize');
const config = require('./config');

// Create Sequelize instance
const sequelize = new Sequelize({
  database: config.DB_NAME,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  dialect: config.DB_DIALECT,
  logging: config.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Function to create a new schema for each tenant
const createTenantSchema = async (schemaName) => {
  try {
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    return true;
  } catch (error) {
    console.error(`Error creating schema ${schemaName}:`, error);
    return false;
  }
};

// Function to set search path for a tenant
const setTenantSchema = async (schemaName) => {
  try {
    await sequelize.query(`SET search_path TO "${schemaName}", public`);
    return true;
  } catch (error) {
    console.error(`Error setting schema ${schemaName}:`, error);
    return false;
  }
};

// Export the sequelize instance and helper functions
module.exports = {
  sequelize,
  createTenantSchema,
  setTenantSchema,
};