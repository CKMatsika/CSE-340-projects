# CSE 340 Vehicle Inventory Management System

This is a Node.js/Express web application for managing vehicle inventory with classifications.

## Features

- View vehicles by classification
- View individual vehicle details
- Add new vehicle classifications
- Add new vehicles to inventory
- Client-side and server-side validation
- Sticky form inputs for better UX
- Flash messages for user feedback

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database named `cse340db`
   - Run the database schema (provided separately)

4. Configure environment variables in `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cse340db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   SESSION_SECRET=your-secret-key
   PORT=5500
   ```

5. Start the application:
   ```bash
   npm start
   ```

## Database Schema

The application expects the following tables:

### classification table:
```sql
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);
```

### inventory table:
```sql
CREATE TABLE inventory (
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
);
```

## Usage

1. Navigate to `http://localhost:5500` for the home page
2. Go to `/inv/` for inventory management
3. Use the management interface to:
   - Add new classifications
   - Add new vehicles
4. View vehicles by classification or individual details

## Project Structure

- `app.js` - Main application file
- `controllers/` - Request handlers
- `models/` - Database interaction
- `routes/` - Route definitions
- `utilities/` - Helper functions and validation
- `views/` - EJS templates
- `public/` - Static assets
- `database/` - Database configuration

## Technologies Used

- Node.js
- Express.js
- EJS templating
- PostgreSQL
- express-validator
- express-session
- connect-flash
