// Temporary script to apply the migration
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://vmhoholpeieigwcfpffb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaG9ob2xwZWllaWd3Y2ZwZmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTU0MTgsImV4cCI6MjA3NTk5MTQxOH0.6WuoycX7nCSErM3Zfi1Uf3EMrYaz2MEKfnSguwi9Nb8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function applyMigration() {
  const migration = readFileSync('./supabase/migrations/20240104000000_create_rate_limiting_table.sql', 'utf-8');

  console.log('Applying migration...');

  const { data, error } = await supabase.rpc('exec_sql', {
    sql: migration
  });

  if (error) {
    console.error('Error applying migration:', error);
  } else {
    console.log('Migration applied successfully!');
    console.log(data);
  }
}

applyMigration();
