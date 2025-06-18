/*
  # Create drones table

  1. New Tables
    - `drones`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `image_url` (text)
      - `description` (text)
      - `max_speed` (text)
      - `range` (text) 
      - `flight_time` (text)
      - `payload` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `drones` table
    - Add policy for public read access
    - Add policy for authenticated users to manage drones
*/

-- Create the drones table
CREATE TABLE IF NOT EXISTS drones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  max_speed text NOT NULL,
  range text NOT NULL,
  flight_time text NOT NULL,
  payload text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE drones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON drones
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage drones"
  ON drones
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial drone data
INSERT INTO drones (name, image_url, description, max_speed, range, flight_time, payload)
VALUES
  ('Hoopoe Drone', 'https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg', 'The flagship model featuring advanced AI-driven navigation and multi-agent coordination capabilities for complex missions.', '120 km/h', '15 km', '45 minutes', '2.5 kg'),
  ('Pigeon Drone', 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg', 'Long-range specialist with extended flight time and enhanced payload capacity for demanding operations.', '100 km/h', '20 km', '60 minutes', '3.5 kg'),
  ('Crow Drone', 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg', 'Agile reconnaissance specialist designed for rapid deployment in urban environments.', '150 km/h', '10 km', '30 minutes', '1.5 kg'),
  ('Eagle Drone', 'https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg', 'Heavy-lift platform optimized for cargo transport and industrial applications requiring substantial payload capacity.', '80 km/h', '25 km', '40 minutes', '8.0 kg'),
  ('Bee Drone', 'https://images.pexels.com/photos/53903/pexels-photo-53903.jpeg', 'Low-profile design with advanced stealth capabilities for covert operations and sensitive missions.', '130 km/h', '18 km', '35 minutes', '2.0 kg'),
  ('Sparrow Drone', 'https://images.pexels.com/photos/1087181/pexels-photo-1087181.jpeg', 'Weather-resistant drone designed for reliable performance in challenging atmospheric conditions.', '110 km/h', '12 km', '50 minutes', '3.0 kg'),
  ('Phoenix Drone', 'https://images.pexels.com/photos/1087214/pexels-photo-1087214.jpeg', 'Cold-weather specialist with thermal management systems for polar and high-altitude operations.', '90 km/h', '22 km', '55 minutes', '4.0 kg'),
  ('Goshawk Drone', 'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg', 'Heat-optimized design for extended operations in high-temperature environments and arid conditions.', '95 km/h', '30 km', '70 minutes', '3.2 kg'),
  ('Falcon Drone', 'https://images.pexels.com/photos/1087183/pexels-photo-1087183.jpeg', 'Corrosion-resistant construction for maritime surveillance and coastal monitoring missions.', '85 km/h', '28 km', '65 minutes', '4.5 kg'),
  ('Owl Drone', 'https://images.pexels.com/photos/1087185/pexels-photo-1087185.jpeg', 'Precision navigation system for safe and efficient operation in dense urban environments.', '105 km/h', '16 km', '48 minutes', '2.8 kg');