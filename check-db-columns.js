const { Client } = require('pg');

async function checkColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['inventory']);
    console.log('Inventory table columns:');
    result.rows.forEach(row => console.log('- ' + row.column_name));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkColumns();
