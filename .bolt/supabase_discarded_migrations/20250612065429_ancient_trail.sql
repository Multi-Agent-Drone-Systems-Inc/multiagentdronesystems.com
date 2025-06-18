/*
  # Add price column to droneslist table

  1. Changes
    - Add price column to droneslist table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'droneslist' AND column_name = 'price'
  ) THEN
    ALTER TABLE droneslist ADD COLUMN price decimal(10,2);
  END IF;
END $$;