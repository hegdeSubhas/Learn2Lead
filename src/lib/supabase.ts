
import { createClient as createBrowserClient } from './supabase/client';
import { createClient as createServerClient } from './supabase/server';

// This file is a placeholder to avoid breaking changes.
// You should import from './supabase/client' or './supabase/server' directly.

const isServer = typeof window === 'undefined';

export const supabase = isServer ? createServerClient() : createBrowserClient();
