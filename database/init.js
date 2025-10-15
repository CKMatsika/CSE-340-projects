const pool = require('./database/index.js');

async function initializeDatabase() {
  try {
    // Create account table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS account (
        account_id SERIAL PRIMARY KEY,
        account_firstname VARCHAR(50) NOT NULL,
        account_lastname VARCHAR(50) NOT NULL,
        account_email VARCHAR(100) NOT NULL UNIQUE,
        account_password VARCHAR(255) NOT NULL,
        account_type VARCHAR(20) NOT NULL DEFAULT 'Client'
      )
    `);

    // Create classification table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classification (
        classification_id SERIAL PRIMARY KEY,
        classification_name VARCHAR(50) NOT NULL UNIQUE
      )
    `);

    // Create inventory table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        inv_id SERIAL PRIMARY KEY,
        inv_make VARCHAR(50) NOT NULL,
        inv_model VARCHAR(50) NOT NULL,
        inv_year INTEGER NOT NULL,
        inv_description TEXT,
        inv_image VARCHAR(255),
        inv_thumbnail VARCHAR(255),
        inv_price DECIMAL(10,2) NOT NULL,
        inv_miles INTEGER,
        inv_color VARCHAR(50),
        classification_id INTEGER REFERENCES classification(classification_id)
      )
    `);

    console.log('Database schema initialized successfully');

    // Insert sample data if tables are empty
    const accountCount = await pool.query('SELECT COUNT(*) FROM account');
    if (parseInt(accountCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        'Test',
        'User',
        'test@example.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // "password" hashed
        'Client'
      ]);

      // Insert sample classifications
      await pool.query(`
        INSERT INTO classification (classification_name) VALUES
        ('SUV'), ('Sedan'), ('Truck'), ('Coupe')
      `);

      console.log('Sample data inserted');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;
