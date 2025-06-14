/*
  # Create all required tables for MADS application

  1. New Tables
    - `faq` - Frequently asked questions
    - `droneslist` - Drone products catalog
    - `reviews` - Customer reviews
    - `positions` - Job positions

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Sample Data
    - Insert sample data for all tables to demonstrate functionality
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
  email text,
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

-- Create policies for FAQ (public read)
CREATE POLICY "FAQ is publicly readable"
  ON faq
  FOR SELECT
  TO public
  USING (true);

-- Create policies for droneslist (public read)
CREATE POLICY "Droneslist is publicly readable"
  ON droneslist
  FOR SELECT
  TO public
  USING (true);

-- Create policies for reviews (public read, authenticated write)
CREATE POLICY "Reviews are publicly readable"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for positions (public read)
CREATE POLICY "Positions are publicly readable"
  ON positions
  FOR SELECT
  TO public
  USING (true);

-- Insert sample FAQ data
INSERT INTO faq (question, answer, is_active, "order") VALUES
('What are multi-agent drone systems?', 'Multi-agent drone systems are networks of autonomous drones that work together to accomplish complex tasks. Each drone operates independently while coordinating with others in the swarm to achieve shared objectives.', true, 1),
('How do your drones communicate with each other?', 'Our drones use advanced mesh networking technology with encrypted communication protocols. They maintain constant real-time communication with nearby units, enabling synchronized operations and adaptive mission planning.', true, 2),
('What industries can benefit from your drone technology?', 'Our systems are ideal for surveillance, search and rescue, agricultural monitoring, infrastructure inspection, delivery services, and environmental research. The versatile design allows for customization across various sectors.', true, 3),
('How long can your drones operate autonomously?', 'Flight time varies by model, but our drones typically operate for 45-90 minutes on a single charge. The swarm intelligence allows for coordinated battery management and mission handoffs between units.', true, 4),
('What safety measures are built into your systems?', 'Our drones feature multiple redundant safety systems including obstacle avoidance, emergency landing protocols, geofencing, and fail-safe return-to-home functionality. All operations comply with aviation safety standards.', true, 5)
ON CONFLICT DO NOTHING;

-- Insert sample droneslist data
INSERT INTO droneslist (name, image_url, description, price, range, flight_time, max_speed, payload) VALUES
('Falcon X1', 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800', 'Advanced reconnaissance drone with AI-powered navigation and real-time data processing capabilities. Perfect for surveillance and monitoring missions.', 15000, '15 km', '60 minutes', '80 km/h', '2.5 kg'),
('Eagle Pro', 'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800', 'Heavy-duty industrial drone designed for cargo delivery and infrastructure inspection. Features enhanced stability and weather resistance.', 25000, '25 km', '90 minutes', '65 km/h', '5.0 kg'),
('Swift Scout', 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=800', 'Compact and agile drone optimized for rapid deployment and close-range operations. Ideal for search and rescue missions.', 8000, '8 km', '45 minutes', '95 km/h', '1.2 kg'),
('Titan Guardian', 'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=800', 'Military-grade drone with advanced defensive capabilities and extended operational range. Built for critical security applications.', 45000, '50 km', '120 minutes', '70 km/h', '8.0 kg'),
('Nimbus Mapper', 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800', 'Specialized mapping and surveying drone with high-precision sensors and automated flight planning. Perfect for agricultural and environmental monitoring.', 18000, '20 km', '75 minutes', '55 km/h', '3.5 kg')
ON CONFLICT DO NOTHING;

-- Insert sample reviews data
INSERT INTO reviews (name, title, body, rating, email, submitted_at) VALUES
('Alex Johnson', 'Exceptional Performance', 'The Falcon X1 exceeded all our expectations. The AI navigation is incredibly precise and the real-time data processing has revolutionized our surveillance operations.', 5, 'alex.johnson@example.com', now() - interval '2 days'),
('Sarah Chen', 'Game Changer for Our Business', 'We have been using the Eagle Pro for infrastructure inspections and it has saved us countless hours. The weather resistance is outstanding and the payload capacity is perfect for our equipment.', 5, 'sarah.chen@example.com', now() - interval '5 days'),
('Mike Rodriguez', 'Impressive Technology', 'The Swift Scout is incredibly agile and responsive. Perfect for our search and rescue operations. The quick deployment feature has been crucial in emergency situations.', 4, 'mike.rodriguez@example.com', now() - interval '1 week'),
('Emily Davis', 'Professional Grade Quality', 'The build quality and reliability of these drones is exceptional. Our team has been using them for months without any issues. Highly recommended for professional applications.', 5, 'emily.davis@example.com', now() - interval '10 days'),
('David Wilson', 'Great Value', 'For the price point, these drones offer incredible value. The features and performance rival much more expensive alternatives. Very satisfied with our purchase.', 4, 'david.wilson@example.com', now() - interval '2 weeks')
ON CONFLICT DO NOTHING;

-- Insert sample positions data
INSERT INTO positions (title, location_type, employment_type, description, open) VALUES
('Senior Drone Systems Engineer', 'Remote/Hybrid', 'Full-time', 'Lead the development of next-generation autonomous drone systems. Work with cutting-edge AI and robotics technology to create innovative solutions for multi-agent coordination.', true),
('AI/ML Research Scientist', 'Edmonton, AB', 'Full-time', 'Research and develop machine learning algorithms for drone swarm intelligence. Focus on real-time decision making, path planning, and collaborative behaviors.', true),
('Flight Test Engineer', 'Edmonton, AB', 'Full-time', 'Conduct comprehensive testing of drone systems in various environments. Ensure safety, reliability, and performance standards are met across all product lines.', true),
('Product Manager - Drone Solutions', 'Remote', 'Full-time', 'Drive product strategy and roadmap for our drone platform. Work closely with engineering, sales, and customers to deliver market-leading solutions.', true),
('Embedded Systems Developer', 'Edmonton, AB', 'Full-time', 'Develop low-level software for drone control systems. Work with microcontrollers, sensors, and communication protocols to enable autonomous flight capabilities.', true)
ON CONFLICT DO NOTHING;