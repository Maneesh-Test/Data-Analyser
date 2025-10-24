# ⚡ ONE-STEP DEPLOYMENT

You already have the tables! Just add the SQL functions.

## THE ONLY STEP

1. Go to: https://supabase.com/dashboard/project/vmhoholpeieigwcfpffb/sql/new
2. Copy and paste this SQL:

```sql
-- Add RPC functions for rate limiting
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

GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION insert_api_usage TO authenticated, service_role, anon;
```

3. Click **Run**
4. You should see "Success. No rows returned"

## That's It!

Your app is now configured. Rate limiting works automatically.

## What You Get

- 200 requests/day per user
- Resets at midnight automatically
- All usage logged to `api_usage_logs`
- API key stays safe in .env file

## Test It

1. Refresh your app
2. Make an AI request
3. Check Supabase → Table Editor → `api_rate_limits`
4. You'll see a row with request_count = 1
