import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egqstnmqyhjsymokkxgg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncXN0bm1xeWhqc3ltb2treGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjAxMTUsImV4cCI6MjA3MzU5NjExNX0.oZ7Msk9tKdN7eTzDbuFfa6A6QFgM6x7KpcUX-xFehvM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  }
});