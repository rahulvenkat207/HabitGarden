import { supabaseAuth } from "../config/supabase";

/**
 * Debug JWT token validation
 * This utility can be used to test JWT tokens directly
 */
export async function debugJwtToken(token: string) {
  console.log('Debugging JWT token...');
  console.log('Token length:', token?.length);
  console.log('Token preview:', token?.substring(0, 20) + '...');
  
  try {
    // Test the token validation
    const { data, error } = await supabaseAuth.auth.getUser(token);
    
    if (error) {
      console.error('JWT Token Validation Error:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      return { valid: false, error: error.message };
    }
    
    if (data?.user) {
      console.log('JWT Token Valid:', {
        userId: data.user.id,
        email: data.user.email,
        aud: data.user.aud,
        role: data.user.role
      });
      return { valid: true, user: data.user };
    }
    
    return { valid: false, error: 'No user data returned' };
  } catch (error) {
    console.error('JWT Token Test Error:', error);
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}