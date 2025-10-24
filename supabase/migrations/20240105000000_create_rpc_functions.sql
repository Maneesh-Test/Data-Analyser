/*
  # Create RPC Functions for Rate Limiting

  1. Functions
    - `insert_api_usage` - Logs API usage to api_usage_logs table
    - `check_rate_limit` - Checks and updates rate limits in api_rate_limits table
    - `get_user_rate_limit` - Gets current rate limit status for a user

  2. Purpose
    - Enable Edge Functions to interact with rate limiting tables
    - Provide atomic operations for concurrent request handling
    - Log all API usage for analytics
*/

-- Function to insert API usage log
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

-- Function to check and update rate limit
-- Returns: JSON with {allowed: boolean, remaining: number, limit: number, reset_at: timestamp}
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
  v_result jsonb;
BEGIN
  v_reset_date := CURRENT_DATE;

  -- Check if record exists for today
  SELECT EXISTS(
    SELECT 1 FROM api_rate_limits
    WHERE user_id = p_user_id AND reset_date = v_reset_date
  ) INTO v_record_exists;

  IF NOT v_record_exists THEN
    -- Create new record for today
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

  -- Get current count
  SELECT request_count INTO v_current_count
  FROM api_rate_limits
  WHERE user_id = p_user_id AND reset_date = v_reset_date;

  -- Check if limit exceeded
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

  -- Increment counter
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

-- Function to get current rate limit status (read-only)
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

  -- Get current count
  SELECT COALESCE(request_count, 0) INTO v_current_count
  FROM api_rate_limits
  WHERE user_id = p_user_id AND reset_date = v_reset_date;

  -- If no record, they haven't made any requests today
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION insert_api_usage TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_rate_limit TO authenticated;

-- Also grant to service_role for Edge Functions
GRANT EXECUTE ON FUNCTION insert_api_usage TO service_role;
GRANT EXECUTE ON FUNCTION check_rate_limit TO service_role;
GRANT EXECUTE ON FUNCTION get_user_rate_limit TO service_role;
