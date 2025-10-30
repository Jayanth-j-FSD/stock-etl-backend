const { Client } = require('pg');
require('dotenv').config();

async function cleanupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'stocks_db',
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('\nDropping existing tables...');

    // Drop tables in correct order (respecting foreign keys)
    await client.query('DROP TABLE IF EXISTS refresh_tokens CASCADE;');
    console.log('✓ Dropped refresh_tokens table');

    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✓ Dropped users table');

    await client.query('DROP TABLE IF EXISTS stocks CASCADE;');
    console.log('✓ Dropped stocks table');

    await client.query('DROP TABLE IF EXISTS currencies CASCADE;');
    console.log('✓ Dropped currencies table');

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('TypeORM will recreate the tables on next startup.\n');

  } catch (error) {
    console.error('❌ Error during database cleanup:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

cleanupDatabase();
