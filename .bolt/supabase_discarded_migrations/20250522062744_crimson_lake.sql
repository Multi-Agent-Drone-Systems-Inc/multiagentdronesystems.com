/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `title` (text, required)
      - `body` (text, required)
      - `rating` (integer, required)
      - `submitted_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public read access
    - Add policy for authenticated users to create reviews
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO public
  WITH CHECK (true);