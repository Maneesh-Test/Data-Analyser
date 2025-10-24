/*
  # Create Rate Limiting Table

  1. New Tables
    - `api_usage`
      - `id` (uuid, primary key)
      - `user_id` (text, indexed) - User identifier from JWT
      - `request_count` (integer) - Number of requests made today
      - `reset_date` (date) - The date this counter resets
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `api_usage` table
    - Add policy for authenticated users to read their own usage
    - Service role can manage all records (for Edge Function)

  3. Indexes
    - Index on user_id and reset_date for fast lookups
*/

-- Create the api_usage table
CREATE TABLE IF NOT EXISTS api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  request_count integer DEFAULT 0,
  reset_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index on user_id and reset_date
CREATE UNIQUE INDEX IF NOT EXISTS api_usage_user_date_idx ON api_usage(user_id, reset_date);

-- Enable RLS
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own usage
CREATE POLICY "Users can read own usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy: Service role can do everything (for Edge Function)
CREATE POLICY "Service role has full access"
  ON api_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_api_usage_updated_at
  BEFORE UPDATE ON api_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_api_usage_updated_at();
