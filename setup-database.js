const fs = require('fs');
const path = require('path');
const { query } = require('./database/');

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read and execute database rebuild script
    const rebuildScript = fs.readFileSync(path.join(__dirname, 'database', 'database_rebuild.sql'), 'utf8');

    // Split the script by semicolon to execute each statement separately
    const statements = rebuildScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await query(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
          console.error('✗ Error executing:', statement.substring(0, 50) + '...');
          console.error('Error:', err.message);
        }
      }
    }

    console.log('Database setup completed!');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
