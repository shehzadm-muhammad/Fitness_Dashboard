const supabaseUrl = 'https://ishwlnjrcprdbhdefqtt.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzaHdsbmpyY3ByZGJoZGVmcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODQzNDEsImV4cCI6MjA1NDc2MDM0MX0.SY7vhUM2f1crE0xo__pLn2oNycOnfejmW3lLcC83qqM';

export const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseAnonKey
);
