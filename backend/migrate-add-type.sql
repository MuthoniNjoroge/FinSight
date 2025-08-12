-- Migration script to add type column to expenses table
-- Run this script to update existing database

-- Add type column to expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS type VARCHAR(10) NOT NULL DEFAULT 'expense';

-- Add check constraint to ensure type is either 'income' or 'expense'
ALTER TABLE expenses ADD CONSTRAINT IF NOT EXISTS expenses_type_check CHECK (type IN ('income', 'expense'));

-- Update existing records to have type 'expense' (default behavior)
UPDATE expenses SET type = 'expense' WHERE type IS NULL OR type = ''; 