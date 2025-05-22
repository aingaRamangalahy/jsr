import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be set in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Sign in with GitHub OAuth
 * This redirects the user to GitHub's authorization page
 */
export const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Handle the OAuth callback
 * This is called when the user is redirected back from the OAuth provider
 */
export const handleAuthCallback = async () => {
  // Supabase will automatically exchange the code for a session
  // We just need to retrieve the session after the exchange
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error handling auth callback:', error)
    throw error
  }
  
  return data
}

/**
 * Get current user session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Get current user
 */
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    throw error
  }
  
  return data.user
}

/**
 * Sign out user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
} 