const app = require('./app.js');
const initializeDatabase = require('./database/init.js');

const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

// Initialize database before starting server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialization completed');

    app.listen(port, () => {
      console.log(`app listening on ${host}:${port}`)
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
