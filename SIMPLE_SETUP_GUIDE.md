# Super Simple Setup Guide - Just 2 Steps!

## What's the situation?

You have a Supabase database already running. I can see it in your screenshot. Now we just need to:
1. Add some SQL functions to your database
2. Your app will automatically work!

**NO deployment needed** - the database is already connected to your app!

---

## Step 1: Run SQL in Supabase (2 minutes)

1. Open your Supabase Dashboard at: https://supabase.com/dashboard
2. Find your project (the one with tables `api_rate_limits` and `api_usage_logs`)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `setup-database.sql` from this project
6. **Copy the ENTIRE contents** and paste into the SQL Editor
7. Click **Run** or press `Ctrl+Enter`

That's it! You should see "Success. No rows returned" - that's good!

---

## Step 2: Nothing! You're Done!

Your app is already configured to use the database. Just refresh your app and start using it.

---

## How to Test It Works

1. Open your app in the browser
2. Go to any AI feature (like Chat or Analysis)
3. Make a request
4. Go back to Supabase Dashboard → Table Editor
5. Look at the `api_rate_limits` table - you should see a row with your user_id!

---

## What This Does

- ✅ Each family member gets 200 requests per day
- ✅ Counter resets automatically at midnight
- ✅ All usage is logged in `api_usage_logs` table
- ✅ Your API key stays safe (it's in the .env file, not exposed to users)
- ✅ When limit is reached, users get a clear message

---

## FAQ

**Q: Do I need to deploy anything?**
A: No! Your database is already connected. Just run the SQL.

**Q: Where's my API key stored?**
A: It's in your `.env` file. The frontend never sees it.

**Q: Can I change the daily limit?**
A: Yes! In the SQL, change `DEFAULT 200` to whatever you want.

**Q: What if I see "table already exists" errors?**
A: That's fine! The SQL uses `IF NOT EXISTS` so it won't break anything.

**Q: How do I check usage?**
A: Go to Supabase → Table Editor → `api_usage_logs` to see all requests.
