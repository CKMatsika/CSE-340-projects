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
    inventory_id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    classification_id INT NOT NULL,
    inv_description TEXT,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
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
INSERT INTO inventory (make, model, classification_id, inv_description, inv_image, inv_thumbnail)
VALUES
('Ford', 'Mustang', 1, 'Sporty coupe', '/images/mustang.jpg', '/images/mustang_thumb.jpg'),
('Chevrolet', 'Camaro', 1, 'Sporty coupe', '/images/camaro.jpg', '/images/camaro_thumb.jpg'),
('GM', 'Hummer', 2, 'small interiors', '/images/hummer.jpg', '/images/hummer_thumb.jpg');

-- ===========================================
-- QUERIES TO RUN AFTER TABLES EXIST
-- ===========================================

-- 4. Modify GM Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE model = 'GM Hummer'; -- <<< THIS IS THE FIX

-- 6. Update inventory image paths to add '/vehicles' to inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');