-- Task 1: Assignment 2 SQL Queries (Corrected)

-- 1. Insert Tony Stark into the account table
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update Tony Stark's account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

-- 3. Delete Tony Stark from the account table
DELETE FROM account
WHERE email = 'tony@starkent.com';

-- 4. Modify GM Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE model = 'GM Hummer'; -- <<< THIS IS THE FIX

-- 5. Select make, model, and classification name for "Sport" items using INNER JOIN
SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update inventory image paths to add '/vehicles' to inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');