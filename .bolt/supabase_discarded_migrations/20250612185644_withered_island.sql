/*
  # Create all required tables for MADS application

  1. New Tables
    - `faq` - Frequently asked questions
    - `droneslist` - Product catalog for drones
    - `reviews` - Customer reviews
    - `positions` - Job positions/careers

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Sample Data
    - Insert sample data for testing
*/

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create droneslist table
CREATE TABLE IF NOT EXISTS droneslist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  price decimal(10,2),
  range text NOT NULL,
  flight_time text NOT NULL,
  max_speed text NOT NULL,
  payload text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  email text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Create positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location_type text NOT NULL,
  employment_type text NOT NULL,
  description text NOT NULL,
  open boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE droneslist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

-- FAQ policies (public read, authenticated write)
CREATE POLICY "Anyone can read FAQ" ON faq FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert FAQ" ON faq FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update FAQ" ON faq FOR UPDATE TO authenticated USING (true);

-- Droneslist policies (public read, authenticated write)
CREATE POLICY "Anyone can read drones" ON droneslist FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert drones" ON droneslist FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update drones" ON droneslist FOR UPDATE TO authenticated USING (true);

-- Reviews policies (public read, authenticated write)
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (true);

-- Positions policies (public read, authenticated write)
CREATE POLICY "Anyone can read positions" ON positions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert positions" ON positions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update positions" ON positions FOR UPDATE TO authenticated USING (true);

-- Insert sample FAQ data
INSERT INTO faq (question, answer, is_active, "order") VALUES
('What is MADS?', 'MADS (Multi-Agent Drone Systems) is a revolutionary platform that enables autonomous navigation and collaborative drone technology for various industries.', true, 1),
('How do the drones communicate with each other?', 'Our drones use advanced mesh networking technology with encrypted communication protocols to maintain constant coordination and real-time data sharing.', true, 2),
('What industries can benefit from MADS technology?', 'MADS technology is applicable across multiple industries including surveillance, mapping, delivery services, agriculture, search and rescue, and infrastructure inspection.', true, 3),
('What is the range of your drone systems?', 'Our drone systems offer varying ranges depending on the model, from 5km for compact units to over 50km for our long-range surveillance drones.', true, 4),
('How long can the drones operate continuously?', 'Flight times vary by model and payload, ranging from 45 minutes for heavy-duty operations to over 2 hours for standard surveillance missions.', true, 5)
ON CONFLICT DO NOTHING;

-- Insert sample drone data
INSERT INTO droneslist (name, image_url, description, price, range, flight_time, max_speed, payload) VALUES
('Falcon X1', 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg', 'Advanced surveillance drone with AI-powered target recognition and real-time data processing capabilities. Perfect for security and monitoring applications.', 15000.00, '25 km', '90 minutes', '80 km/h', '2.5 kg'),
('Eagle Pro', 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg', 'Heavy-duty industrial drone designed for cargo delivery and infrastructure inspection. Features robust construction and extended flight capabilities.', 25000.00, '40 km', '120 minutes', '65 km/h', '5.0 kg'),
('Swift Scout', 'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg', 'Compact reconnaissance drone optimized for stealth operations and rapid deployment. Ideal for tactical surveillance and emergency response.', 8500.00, '15 km', '60 minutes', '95 km/h', '1.2 kg'),
('Titan Cargo', 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg', 'Large-scale delivery drone capable of transporting heavy payloads across long distances. Built for commercial logistics and supply chain operations.', 35000.00, '60 km', '150 minutes', '55 km/h', '10.0 kg'),
('Phantom Recon', 'https://images.pexels.com/photos/1034650/pexels-photo-1034650.jpeg', 'Stealth surveillance drone with advanced sensor suite and low-noise operation. Designed for covert intelligence gathering and perimeter security.', 18500.00, '30 km', '105 minutes', '70 km/h', '3.0 kg')
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (name, title, body, rating, email, submitted_at) VALUES
('John Smith', 'Exceptional Performance', 'The Falcon X1 exceeded all our expectations. The AI-powered features and real-time processing make it perfect for our security operations.', 5, 'john.smith@example.com', now() - interval '2 days'),
('Sarah Johnson', 'Great Value for Money', 'We have been using the Swift Scout for emergency response and it has proven to be incredibly reliable and fast to deploy.', 4, 'sarah.johnson@example.com', now() - interval '5 days'),
('Mike Chen', 'Outstanding Build Quality', 'The Eagle Pro is built like a tank. We use it for infrastructure inspection and it handles harsh conditions without any issues.', 5, 'mike.chen@example.com', now() - interval '1 week'),
('Lisa Rodriguez', 'Impressive Technology', 'The multi-agent coordination capabilities are truly revolutionary. Our fleet of drones work together seamlessly.', 5, 'lisa.rodriguez@example.com', now() - interval '10 days'),
('David Wilson', 'Reliable and Efficient', 'The Titan Cargo has transformed our delivery operations. The extended flight time and payload capacity are exactly what we needed.', 4, 'david.wilson@example.com', now() - interval '2 weeks')
ON CONFLICT DO NOTHING;

-- Insert sample positions
INSERT INTO positions (title, location_type, employment_type, description, open) VALUES
('Senior Drone Engineer', 'Remote/Hybrid', 'Full-time', 'Lead the development of next-generation autonomous drone systems. Work with cutting-edge AI and robotics technology to push the boundaries of what''s possible in multi-agent coordination.', true),
('AI/ML Research Scientist', 'Edmonton, AB', 'Full-time', 'Research and develop advanced machine learning algorithms for drone swarm intelligence. Focus on real-time decision making and collaborative behavior optimization.', true),
('Flight Systems Developer', 'Remote', 'Full-time', 'Design and implement flight control systems for autonomous drone operations. Ensure safety, reliability, and performance across diverse mission profiles.', true),
('Product Manager - Drone Solutions', 'Edmonton, AB', 'Full-time', 'Drive product strategy and roadmap for our drone platform. Work closely with engineering and customers to deliver innovative solutions that meet market needs.', true),
('Quality Assurance Engineer', 'Hybrid', 'Full-time', 'Ensure the highest quality standards for our drone systems through comprehensive testing and validation. Develop automated testing frameworks and procedures.', true)
ON CONFLICT DO NOTHING;