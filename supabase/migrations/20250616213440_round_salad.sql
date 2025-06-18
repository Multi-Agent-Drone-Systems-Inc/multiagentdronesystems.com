/*
  # Create cart and wishlist tables for user shopping functionality

  1. New Tables
    - `cart_items`
      - `id` (bigint, primary key, auto-increment)
      - `user_id` (uuid, foreign key to auth.users)
      - `drone_id` (bigint, foreign key to droneslist)
      - `quantity` (integer, default 1)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `wishlist_items`
      - `id` (bigint, primary key, auto-increment)
      - `user_id` (uuid, foreign key to auth.users)
      - `drone_id` (bigint, foreign key to droneslist)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for users to only access their own cart/wishlist items
    - Users can insert, select, update, and delete their own items

  3. Constraints
    - Unique constraint on (user_id, drone_id) for both tables to prevent duplicates
    - Foreign key constraints to ensure data integrity
    - Check constraint on quantity to ensure it's positive

  4. Indexes
    - Add indexes on user_id for faster lookups
    - Add indexes on drone_id for joins
*/

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drone_id bigint NOT NULL REFERENCES droneslist(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique cart items per user
  CONSTRAINT unique_user_drone_cart UNIQUE (user_id, drone_id),
  -- Ensure positive quantity
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drone_id bigint NOT NULL REFERENCES droneslist(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique wishlist items per user
  CONSTRAINT unique_user_drone_wishlist UNIQUE (user_id, drone_id)
);

-- Enable RLS on both tables
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Users can manage their own cart items"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wishlist items policies
CREATE POLICY "Users can manage their own wishlist items"
  ON wishlist_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_drone_id ON cart_items(drone_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_drone_id ON wishlist_items(drone_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON wishlist_items(created_at DESC);

-- Add trigger to update updated_at timestamp for cart_items
CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();