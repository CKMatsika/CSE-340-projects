-- This script drops all tables and custom types for a clean rebuild.
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS classification;
DROP TYPE IF EXISTS account_status;