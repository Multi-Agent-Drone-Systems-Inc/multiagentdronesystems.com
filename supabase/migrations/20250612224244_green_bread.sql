/*
  # Create contact table for contact form submissions

  1. New Tables
    - `contact`
      - `id` (bigint, primary key, auto-increment)
      - `first_name` (text, required)
      - `last_name` (text, required) 
      - `email` (text, required)
      - `phone` (text, required)
      - `message` (text, required)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `contact` table
    - Add policy for public insert access (contact forms should be publicly accessible)
    - Add policy for authenticated users to read contact data (for admin purposes)

  3. Indexes
    - Add index on email for faster lookups
    - Add index on created_at for sorting
*/

-- Create contact table
CREATE TABLE IF NOT EXISTS contact (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact form submissions (public access)
CREATE POLICY "Anyone can submit contact forms"
  ON contact
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read contact submissions (for admin purposes)
CREATE POLICY "Authenticated users can read contact submissions"
  ON contact
  FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(email);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_updated_at 
    BEFORE UPDATE ON contact 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();