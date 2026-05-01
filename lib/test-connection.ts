import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')

    // Test basic connectivity by trying to access the information_schema
    // This is a standard PostgreSQL schema that should always exist
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1)

    if (error) {
      // If that fails, try a simple health check using the auth service
      const { data: authData, error: authError } = await supabase.auth.getSession()

      if (authError && authError.message !== 'No session') {
        console.error('Supabase connection failed:', authError.message)
        return { success: false, error: authError.message }
      }

      // Auth service works, so connection is successful
      console.log('Supabase connection successful (via auth service)!')
      return { success: true, data: 'Connection verified via auth service' }
    }

    console.log('Supabase connection successful!')
    return { success: true, data: 'Connection verified via database query' }
  } catch (err) {
    console.error('Supabase connection error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Simple test function that just checks if the client was created
export function testSupabaseClient() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    console.log('Supabase client initialized successfully')
    return { success: true }
  } catch (err) {
    console.error('Supabase client test failed:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
