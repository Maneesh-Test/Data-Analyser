/*
  # Fix Database Security Issues

  This migration addresses multiple security and performance issues:

  ## 1. Add Missing Indexes on Foreign Keys
    - Add index on `comments.parent_comment_id`
    - Add index on `user_api_keys.user_id`

  ## 2. Optimize RLS Policies (Replace auth functions with SELECT subqueries)
    - Fix all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - Improves query performance at scale by preventing re-evaluation per row

  ## 3. Remove Duplicate/Overlapping RLS Policies
    - Remove overlapping permissive policies on `comments` table
    - Remove overlapping permissive policies on `conversations` table
    - Keep only the necessary policies

  ## 4. Add Policies for Tables with RLS Enabled but No Policies
    - Add basic admin-only policies for `DataFromWeb`, `Test`, `api_rate_limits`, `api_usage_logs`

  ## 5. Fix Function Search Paths
    - Update all functions to use explicit schema references

  ## 6. Remove Unused Index
    - Drop unused `conversations_user_id_idx` index
*/

-- ============================================================================
-- SECTION 1: ADD MISSING INDEXES ON FOREIGN KEYS
-- ============================================================================

-- Add index on comments.parent_comment_id foreign key
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON public.comments(parent_comment_id);

-- Add index on user_api_keys.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON public.user_api_keys(user_id);

-- ============================================================================
-- SECTION 2: DROP UNUSED INDEX
-- ============================================================================

DROP INDEX IF EXISTS public.conversations_user_id_idx;

-- ============================================================================
-- SECTION 3: FIX RLS POLICIES - DROP OLD POLICIES
-- ============================================================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Drop all existing policies on comments
DROP POLICY IF EXISTS "comments_admin_full_access" ON public.comments;
DROP POLICY IF EXISTS "comments_delete_owner_only" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_owner_only" ON public.comments;
DROP POLICY IF EXISTS "comments_select_owner_only" ON public.comments;
DROP POLICY IF EXISTS "comments_update_owner_only" ON public.comments;

-- Drop all existing policies on conversations
DROP POLICY IF EXISTS "Users can manage their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can read own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;

-- Drop all existing policies on user_api_keys
DROP POLICY IF EXISTS "Allow individual read access" ON public.user_api_keys;
DROP POLICY IF EXISTS "Allow individual insert access" ON public.user_api_keys;
DROP POLICY IF EXISTS "Allow individual delete access" ON public.user_api_keys;

-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- ============================================================================
-- SECTION 4: CREATE OPTIMIZED RLS POLICIES
-- ============================================================================

-- Profiles table policies (optimized)
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

-- Comments table policies (consolidated, optimized)
CREATE POLICY "comments_select_own"
  ON public.comments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = author_id);

CREATE POLICY "comments_insert_own"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "comments_update_own"
  ON public.comments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id)
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "comments_delete_own"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- Conversations table policies (consolidated, optimized)
CREATE POLICY "conversations_select_own"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "conversations_insert_own"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "conversations_update_own"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "conversations_delete_own"
  ON public.conversations
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- User API keys table policies (optimized)
CREATE POLICY "user_api_keys_select_own"
  ON public.user_api_keys
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "user_api_keys_insert_own"
  ON public.user_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "user_api_keys_delete_own"
  ON public.user_api_keys
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- User profiles table policies (optimized)
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================================
-- SECTION 5: ADD POLICIES FOR TABLES WITH RLS BUT NO POLICIES
-- ============================================================================

-- DataFromWeb: Admin-only access (service_role)
CREATE POLICY "admin_all_access"
  ON public."DataFromWeb"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Test: Admin-only access (service_role)
CREATE POLICY "admin_all_access"
  ON public."Test"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- api_rate_limits: Admin-only access (service_role)
CREATE POLICY "admin_all_access"
  ON public.api_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- api_usage_logs: Admin-only access (service_role)
CREATE POLICY "admin_all_access"
  ON public.api_usage_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- SECTION 6: FIX FUNCTION SEARCH PATHS
-- ============================================================================

-- Recreate update_updated_at function with explicit schema
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate create_profile_for_user function with explicit schema
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Recreate check_rate_limit function with explicit schema
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_api_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
  v_limit INTEGER;
BEGIN
  v_window_start := date_trunc('minute', now());
  
  SELECT request_count, limit_per_window
  INTO v_count, v_limit
  FROM public.api_rate_limits
  WHERE api_key = p_api_key AND window_start = v_window_start;
  
  IF NOT FOUND THEN
    INSERT INTO public.api_rate_limits (api_key, window_start, request_count)
    VALUES (p_api_key, v_window_start, 1);
    RETURN TRUE;
  END IF;
  
  IF v_count >= v_limit THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.api_rate_limits
  SET request_count = request_count + 1
  WHERE api_key = p_api_key AND window_start = v_window_start;
  
  RETURN TRUE;
END;
$$;

-- Recreate insert_api_usage function with explicit schema
CREATE OR REPLACE FUNCTION public.insert_api_usage(
  p_api_key TEXT,
  p_path TEXT,
  p_method TEXT,
  p_status INTEGER,
  p_response_time INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.api_usage_logs (api_key, path, method, status, response_time_ms)
  VALUES (p_api_key, p_path, p_method, p_status, p_response_time);
END;
$$;

-- Recreate handle_new_user function with explicit schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify indexes exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND indexname = 'idx_comments_parent_comment_id'
  ) THEN
    RAISE EXCEPTION 'Index idx_comments_parent_comment_id was not created';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'user_api_keys' 
    AND indexname = 'idx_user_api_keys_user_id'
  ) THEN
    RAISE EXCEPTION 'Index idx_user_api_keys_user_id was not created';
  END IF;

  RAISE NOTICE 'All security fixes have been successfully applied!';
END $$;
