-- ===========================================
-- DATABASE REBUILD FILE - CORRECTED
-- ===========================================

-- 1. PostgreSQL type definitions (if any)
CREATE TYPE account_status AS ENUM ('Active', 'Inactive', 'Pending');

-- 2. Create tables
-- If tables exist, drop them to ensure a clean slate
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;
DROP TYPE IF EXISTS account_status; -- Drop the type too if you are recreating it

-- Recreate the type
CREATE TYPE account_status AS ENUM ('Active', 'Inactive', 'Pending');

-- 2.1 Classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);

-- 2.2 Inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year VARCHAR(10),
    inv_description TEXT,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    inv_price NUMERIC(10,2),
    inv_miles INTEGER,
    inv_color VARCHAR(50),
    classification_id INT NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

-- 2.3 Account table (example if needed)
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'Client',
    status account_status DEFAULT 'Active'
);

-- 3. Insert initial data

-- 3.1 Populate classification table
INSERT INTO classification (classification_name)
VALUES 
('Sport'),
('SUV'),
('Truck');

-- 3.2 Populate inventory table
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES
('Ford', 'Mustang', '2020', 'Sporty coupe', '/images/mustang.jpg', '/images/mustang_thumb.jpg', 35000, 25000, 'Red', 1),
('Chevrolet', 'Camaro', '2019', 'Sporty coupe', '/images/camaro.jpg', '/images/camaro_thumb.jpg', 32000, 18000, 'Blue', 1),
('GM', 'Hummer', '2021', 'Large SUV with huge interior', '/images/hummer.jpg', '/images/hummer_thumb.jpg', 45000, 15000, 'Black', 2);

-- ===========================================
-- QUERIES TO RUN AFTER TABLES EXIST
-- ===========================================

-- 4. Modify GM Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer'; -- Fixed column name and value

-- 6. Update inventory image paths to add '/vehicles' to inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');