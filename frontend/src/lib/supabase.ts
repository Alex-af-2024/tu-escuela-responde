import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether the Supabase environment variables are configured.
 * Pages should check this and show a setup message instead of crashing.
 */
export const isSupabaseConfigured: boolean =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== 'https://YOUR_PROJECT_REF.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here';

/**
 * Supabase client — safe to import even when env vars are missing.
 * Operations will fail gracefully at runtime.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
);

/**
 * Allowed email domain for institutional signup.
 */
export const ALLOWED_DOMAIN = '@alumnos.santotomas.cl';

/**
 * Validates that an email belongs to the allowed institutional domain.
 */
export function isValidInstitutionalEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
}
