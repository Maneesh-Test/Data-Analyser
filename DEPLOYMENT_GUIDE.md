# Deployment Guide: Secure Your Gemini API Key

## Overview

This guide will help you deploy the secure Edge Function to protect your Gemini API key from exposure. Currently, your API key is visible in the client-side code, which means anyone can copy and use it.

## What We're Deploying

1. **Database Table** for rate limiting (200 requests/day per user)
2. **Edge Function** that proxies API calls securely
3. **Frontend Updates** to use the secure proxy

## Step 1: Apply Database Migration

You need to create the `api_usage` table in your Supabase database.

### Option A: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor"
4. Create a new query
5. Copy and paste the contents of `supabase/migrations/20240104000000_create_rate_limiting_table.sql`
6. Click "Run"

### Option B: Using Supabase CLI

```bash
# Navigate to project directory
cd /path/to/your/project

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref 0ec90b57d6e95fcbda19832f

# Push the migration
supabase db push
```

## Step 2: Deploy the Edge Function

### Option A: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to "Edge Functions" in the left sidebar
4. Click "Create Function"
5. Name it `gemini-proxy`
6. Copy the contents of `supabase/functions/gemini-proxy/index.ts`
7. Paste into the editor
8. Click "Deploy"

### Option B: Using Supabase CLI (Recommended)

```bash
# Deploy the function
supabase functions deploy gemini-proxy

# Set the Gemini API key as a secret (IMPORTANT!)
supabase secrets set GEMINI_API_KEY=AIzaSyATqXef-kREE1Ov72tagCb_GxdEMa7cmNo
```

## Step 3: Verify Deployment

Test the Edge Function:

```bash
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/gemini-proxy \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "models/gemini-2.5-flash:generateContent",
    "body": {
      "contents": [{"parts": [{"text": "Hello"}]}]
    },
    "method": "POST"
  }'
```

You should get a response with rate limit headers.

## Step 4: Remove API Key from Client

After deployment is successful:

1. Remove `GEMINI_API_KEY` from your `.env` file (keep only `VITE_SUPABASE_*` vars)
2. The frontend code is already configured to use the proxy

## How It Works

### Before (INSECURE):
```
User Browser → Gemini API (with exposed key)
```

### After (SECURE):
```
User Browser → Edge Function → Gemini API
                ↑
                API key hidden here
                Rate limiting enforced
```

## Rate Limiting

- Each authenticated user gets 200 requests/day
- Counter resets daily at midnight UTC
- Usage is tracked in the `api_usage` database table
- Users can add their own API key in settings for unlimited access

## Troubleshooting

### "API key not configured on server"
- You forgot to set the secret: `supabase secrets set GEMINI_API_KEY=YOUR_KEY`

### "Missing authorization header"
- Your auth token isn't being sent. Check that users are logged in.

### "Daily rate limit exceeded"
- User has hit 200 requests today. They can wait or add their own key.

### Function not deploying
- Make sure you're in the project directory
- Verify `supabase link` shows the correct project
- Check function logs in Supabase Dashboard

## Security Benefits

✅ API key never exposed to browser
✅ Real rate limiting per user (can't be bypassed)
✅ Centralized usage tracking
✅ Easy to update key without redeploying frontend
✅ Family members each get their own 200/day limit

## Next Steps

After deployment:
1. Test the app to ensure it still works
2. Check the `api_usage` table to see tracked requests
3. Monitor usage in Supabase Dashboard
4. Remove the API key from `.env` file
5. Deploy your app publicly with confidence!
