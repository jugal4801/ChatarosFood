const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '') ? false : { rejectUnauthorized: false } });
  await client.connect();
  await client.query(fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8'));
  await client.end();
  console.log('Schema applied.');
})().catch(e => { console.error(e); process.exit(1); });
