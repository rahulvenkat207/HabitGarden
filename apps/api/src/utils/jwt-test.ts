import { supabase } from "../config/supabase";

/**
 * Test JWT token validation
 * This utility can be used to verify that JWT tokens are being validated correctly
 */
export async function testJwtToken(token: string) {
  try {
    // Test the token validation
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('JWT Token Validation Error:', error);
      return { valid: false, error: error.message };
    }
    
    if (data?.user) {
      console.log('JWT Token Valid:', {
        userId: data.user.id,
        email: data.user.email,
        aud: data.user.aud
      });
      return { valid: true, user: data.user };
    }
    
    return { valid: false, error: 'No user data returned' };
  } catch (error) {
    console.error('JWT Token Test Error:', error);
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}