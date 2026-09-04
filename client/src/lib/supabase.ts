import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

// Recognise placeholder values that appear when .env.example is copied but not edited.
const PLACEHOLDER_URLS = [
  'https://your-project-ref.supabase.co',
  'https://placeholder.supabase.co',
  '',
  undefined,
  null,
];

const PLACEHOLDER_KEYS = [
  'your-anon-public-key-here',
  'your-supabase-anon-key',
  'your_service_role_key',
  '',
  undefined,
  null,
];

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !PLACEHOLDER_URLS.includes(supabaseUrl as never) &&
  !PLACEHOLDER_KEYS.includes(supabaseAnonKey as never)
);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] Missing or placeholder credentials in .env. ' +
    'Copy .env.example to .env, fill in your Supabase Project URL and anon key, then restart the dev server.'
  );
}

export const supabase = createClient(
  supabaseUrl && !PLACEHOLDER_URLS.includes(supabaseUrl as never)
    ? supabaseUrl
    : 'https://placeholder.supabase.co',
  supabaseAnonKey && !PLACEHOLDER_KEYS.includes(supabaseAnonKey as never)
    ? supabaseAnonKey
    : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'restaurant_admin_session',
    },
  }
);

export const BUCKETS = {
  IMAGES: 'images',
  HOMEPAGE: 'homepage',
} as const;
