const pool = require('./database/index.js');

async function checkInventoryColumns() {
  try {
    // Check inventory table columns
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'inventory'
      ORDER BY ordinal_position
    `);

    console.log('Inventory table schema:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? 'DEFAULT: ' + row.column_default : ''}`);
    });

    // Check if there's a primary key
    const pkResult = await pool.query(`
      SELECT c.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
      JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
        AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_name = 'inventory'
    `);

    if (pkResult.rows.length > 0) {
      console.log('Primary key column:', pkResult.rows[0].column_name);
    } else {
      console.log('No primary key found');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

checkInventoryColumns();
