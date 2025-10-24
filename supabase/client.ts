import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

if (!SUPABASE_URL || SUPABASE_URL.includes('PASTE_YOUR_SUPABASE_URL_HERE')) {
    throw new Error('Supabase URL is not configured. Please add it to `config.ts`.');
}
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('PASTE_YOUR_SUPABASE_ANON_KEY_HERE')) {
     throw new Error('Supabase anon key is not configured. Please add it to `config.ts`.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
