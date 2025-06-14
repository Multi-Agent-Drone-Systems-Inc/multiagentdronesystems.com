/*
  # Add price column to drones table

  1. Changes
    - Add price column to drones table for USD pricing
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'drones' AND column_name = 'price'
  ) THEN
    ALTER TABLE drones ADD COLUMN price decimal(10,2);
  END IF;
END $$;