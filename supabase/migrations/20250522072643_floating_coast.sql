/*
  # Add email column to reviews table

  1. Changes
    - Add email column to reviews table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'email'
  ) THEN
    ALTER TABLE reviews ADD COLUMN email text;
  END IF;
END $$;