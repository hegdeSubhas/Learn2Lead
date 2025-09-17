'use server';
/**
 * @fileOverview A diagnostic flow to test Supabase connectivity.
 */

import { ai } from '@/ai/genkit';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export async function testSupabaseConnection(): Promise<string> {
  try {
    createClient();
    return 'Supabase client initialized successfully using environment variables.';
  } catch (e: any) {
    return `Error initializing Supabase client: ${e.message}`;
  }
}

export async function testProfilesTable(): Promise<string> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      if (error.code === '42P01') {
        return `Error: Table 'profiles' not found. The SQL script to create the table might not have been run correctly. Details: ${error.message}`;
      }
      return `An error occurred while querying the profiles table: ${error.message}`;
    }

    return `Successfully queried the 'profiles' table. Found ${data.length} records. The connection is working correctly.`;
  } catch (e: any) {
    return `An unexpected error occurred: ${e.message}`;
  }
}
