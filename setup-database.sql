-- COPY AND PASTE THIS ENTIRE FILE INTO YOUR SUPABASE SQL EDITOR
-- This will create the tables and functions needed for rate limiting

-- Step 1: Create the api_rate_limits table
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  request_count integer DEFAULT 0,
  daily_limit integer DEFAULT 200,
  reset_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS api_rate_limits_user_date_idx
  ON api_rate_limits(user_id, reset_date);

-- Step 2: Create the api_usage_logs table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  endpoint text NOT NULL,
  tokens_used integer DEFAULT 0,
  response_time_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS api_usage_logs_user_id_idx
  ON api_usage_logs(user_id, created_at DESC);

-- Step 3: Enable RLS
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for api_rate_limits
DROP POLICY IF EXISTS "Users can read own rate limits" ON api_rate_limits;
CREATE POLICY "Users can read own rate limits"
  ON api_rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Service role full access to rate limits" ON api_rate_limits;
CREATE POLICY "Service role full access to rate limits"
  ON api_rate_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 5: Create policies for api_usage_logs
DROP POLICY IF EXISTS "Users can read own usage logs" ON api_usage_logs;
CREATE POLICY "Users can read own usage logs"
  ON api_usage_logs FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Service role full access to usage logs" ON api_usage_logs;
CREATE POLICY "Service role full access to usage logs"
  ON api_usage_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 6: Create RPC function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id text,
  p_daily_limit integer DEFAULT 200
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_count integer;
  v_reset_date date;
  v_record_exists boolean;
BEGIN
  v_reset_date := CURRENT_DATE;

  SELECT EXISTS(
    SELECT 1 FROM api_rate_limits
    WHERE user_id = p_user_id AND reset_date = v_reset_date
  ) INTO v_record_exists;

  IF NOT v_record_exists THEN
    INSERT INTO api_rate_limits (user_id, request_count, daily_limit, reset_date)
    VALUES (p_user_id, 1, p_daily_limit, v_reset_date)
    ON CONFLICT (user_id, reset_date)
    DO UPDATE SET
      request_count = api_rate_limits.request_count + 1,
      updated_at = now();

    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', p_daily_limit - 1,
      'limit', p_daily_limit,
      'used', 1,
      'reset_at', v_reset_date + interval '1 day'
    );
  END IF;

  SELECT request_count INTO v_current_count
  FROM api_rate_limits
  WHERE user_id = p_user_id AND reset_date = v_reset_date;

  IF v_current_count >= p_daily_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'limit', p_daily_limit,
      'used', v_current_count,
      'reset_at', v_reset_date + interval '1 day',
      'message', 'Daily rate limit exceeded'
    );
  END IF;

  UPDATE api_rate_limits
  SET request_count = request_count + 1,
      updated_at = now()
  WHERE user_id = p_user_id AND reset_date = v_reset_date;

  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', p_daily_limit - v_current_count - 1,
    'limit', p_daily_limit,
    'used', v_current_count + 1,
    'reset_at', v_reset_date + interval '1 day'
  );
END;
$$;

-- Step 7: Create RPC function to insert usage logs
CREATE OR REPLACE FUNCTION insert_api_usage(
  p_user_id text,
  p_endpoint text,
  p_tokens_used integer DEFAULT 0,
  p_response_time_ms integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO api_usage_logs (user_id, endpoint, tokens_used, response_time_ms, created_at)
  VALUES (p_user_id, p_endpoint, p_tokens_used, p_response_time_ms, now());
END;
$$;

-- Step 8: Create RPC function to get rate limit status
CREATE OR REPLACE FUNCTION get_user_rate_limit(
  p_user_id text,
  p_daily_limit integer DEFAULT 200
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_count integer;
  v_reset_date date;
BEGIN
  v_reset_date := CURRENT_DATE;

  SELECT COALESCE(request_count, 0) INTO v_current_count
  FROM api_rate_limits
  WHERE user_id = p_user_id AND reset_date = v_reset_date;

  IF v_current_count IS NULL THEN
    v_current_count := 0;
  END IF;

  RETURN jsonb_build_object(
    'remaining', p_daily_limit - v_current_count,
    'limit', p_daily_limit,
    'used', v_current_count,
    'reset_at', v_reset_date + interval '1 day'
  );
END;
$$;

-- Step 9: Grant permissions
GRANT EXECUTE ON FUNCTION insert_api_usage TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_rate_limit TO authenticated, service_role;

-- Done! Your database is ready for rate limiting.
