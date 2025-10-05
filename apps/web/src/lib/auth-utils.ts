/**
 * Authentication utilities for development and testing
 */

import { supabase } from './api';

/**
 * Authentication utilities
 */

import { SupabaseClientOptions } from '@supabase/supabase-js';

/**
 * Check if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV === true;
};

/**
 * Get authentication configuration based on environment
 */
export const getAuthConfig = (): SupabaseClientOptions<'public'> => {
  return {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  };
};

/**
 * Simulate email confirmation for development testing
 * This is a mock function for development purposes only
 */
export const simulateEmailConfirmation = async (email: string): Promise<{ success: boolean; message: string }> => {
  // Only available in development
  if (!isDevelopment()) {
    return {
      success: false,
      message: 'Email confirmation simulation is only available in development mode'
    };
  }
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would:
    // 1. Call an admin endpoint to confirm the user
    // 2. Or use Supabase admin client to update the user record
    
    return {
      success: true,
      message: `Email for ${email} has been confirmed. You can now sign in.`
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to confirm email. Please try again.'
    };
  }
};