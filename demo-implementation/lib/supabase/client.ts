import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey } from './anon-env'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabaseAnonKey()
  )
}
