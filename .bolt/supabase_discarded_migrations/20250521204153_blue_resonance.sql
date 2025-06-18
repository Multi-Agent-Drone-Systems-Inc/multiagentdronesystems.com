/*
  # Create FAQ table

  1. New Tables
    - `faq`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `is_active` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `faq` table
    - Add policy for public read access
    - Add policy for authenticated users to manage FAQs
*/

CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON faq
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage faq"
  ON faq
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial FAQ data
INSERT INTO faq (question, answer, is_active, display_order) VALUES
  ('What sets MADS drones apart from conventional drones?', 'MADS drones feature advanced multi-agent coordination capabilities, allowing them to work together autonomously. Our proprietary AI systems enable real-time adaptation to changing conditions, superior navigation accuracy, and enhanced mission efficiency compared to traditional single-drone systems.', true, 1),
  ('What safety features are included in MADS drones?', 'All MADS drones include redundant navigation systems, automatic return-to-home functionality, obstacle avoidance technology, and encrypted communications. They also feature fail-safe protocols that ensure safe landing in case of emergencies or low battery conditions.', true, 2),
  ('How long does it take to deploy a MADS drone system?', 'A standard MADS drone system can be deployed within 15 minutes of arrival on-site. Our QuickLaunch protocol includes automated pre-flight checks, mission planning, and system diagnostics to ensure rapid but safe deployment.', true, 3),
  ('What kind of training and support do you provide?', 'We offer comprehensive training programs tailored to your specific needs, including basic operation, advanced mission planning, and maintenance. Our 24/7 technical support team is always available to assist with any questions or concerns.', true, 4),
  ('Are MADS drones compliant with aviation regulations?', 'Yes, all MADS drones are fully compliant with FAA regulations and international aviation standards. We regularly update our firmware to ensure continued compliance with evolving regulations and maintain all necessary certifications.', true, 5);