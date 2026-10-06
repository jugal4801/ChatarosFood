const { Pool } = require('pg');

let pool;
module.exports = function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '') ? false : { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
};
