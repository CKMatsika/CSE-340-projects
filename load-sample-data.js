const fs = require('fs');
const path = require('path');
const { query } = require('./database/');

async function loadSampleData() {
  try {
    console.log('Loading sample data...');

    // Read and execute seed data script
    const seedScript = fs.readFileSync(path.join(__dirname, 'database', 'seed_placeholder_data.sql'), 'utf8');

    // Split the script by semicolon to execute each statement separately
    const statements = seedScript
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

    console.log('Sample data loaded successfully!');

  } catch (error) {
    console.error('Error loading sample data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  loadSampleData();
}

module.exports = { loadSampleData };
