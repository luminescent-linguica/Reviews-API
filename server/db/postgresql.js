require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: '54.219.122.7',
  port: process.env.postgreSQLPORT,
  database: 'sdc',
  user: process.env.postgreSQLUser,
  password: process.env.postgreSQLPassword,
});

module.exports = pool;
