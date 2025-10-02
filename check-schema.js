const pool = require('./database/index.js');

async function checkSchema() {
  try {
    const result = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['inventory']);
    console.log('Inventory table columns:');
    result.rows.forEach(row => console.log(row.column_name));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

checkSchema();
