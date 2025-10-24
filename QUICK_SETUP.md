# Quick Setup Guide

You've already created the tables in Supabase! Now just run these SQL commands and deploy.

## Step 1: Execute SQL (Copy & Paste in Supabase SQL Editor)

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- Run the contents of: supabase/migrations/20240105000000_create_rpc_functions.sql
```

Copy the entire contents of `supabase/migrations/20240105000000_create_rpc_functions.sql` and execute it in the SQL Editor.

This creates 3 RPC functions:
- `check_rate_limit` - Checks and increments user's daily limit
- `insert_api_usage` - Logs each API call
- `get_user_rate_limit` - Gets current usage stats

## Step 2: Deploy Edge Function

Using Supabase CLI:

```bash
cd /path/to/your/project

# Link your project (if not already linked)
supabase link --project-ref vmhoholpeieigwcfpffb

# Deploy the function
supabase functions deploy gemini-proxy

# Set your Gemini API key as a secret
supabase secrets set GEMINI_API_KEY=AIzaSyATqXef-kREE1Ov72tagCb_GxdEMa7cmNo
```

## Step 3: Test It

```bash
# Get your auth token from the browser (localStorage.getItem('authToken'))
curl -X POST https://vmhoholpeieigwcfpffb.supabase.co/functions/v1/gemini-proxy \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "models/gemini-2.5-flash:generateContent",
    "body": {"contents": [{"parts": [{"text": "Say hello"}]}]}
  }'
```

You should see rate limit headers in the response.

## That's It!

Your app will now:
- ✅ Use your existing `api_rate_limits` table
- ✅ Log usage to `api_usage_logs` table
- ✅ Enforce 200 requests/day per user
- ✅ Keep your API key secure on the server

The frontend is already configured to use the proxy!
