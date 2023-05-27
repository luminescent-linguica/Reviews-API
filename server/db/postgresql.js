require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: process.env.postgreSQLPORT,
  database: 'SDC',
  user: process.env.postgreSQLUser,
  password: process.env.postgreSQLPassword,
});

module.exports = pool;
