import { Request, Response, NextFunction } from "express";
import { supabaseAuth } from "../config/supabase";
import { createUser, getUserById } from "../modules/users/users.service";

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('Auth middleware called for URL:', req.url);
  
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header found');
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }
  
  // Check if it's a Bearer token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log('Invalid authorization header format');
    res.status(401).json({ error: "Invalid authorization header format" });
    return;
  }
  
  const token = parts[1];
  if (!token) {
    console.log('No bearer token found');
    res.status(401).json({ error: "Bearer token missing" });
    return;
  }
  
  try {
    console.log('Validating token:', token.substring(0, 20) + '...');
    
    // Validate token with Supabase using the anon key (not service role key)
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    
    if (error) {
      console.error('JWT Validation Error:', error);
      res.status(401).json({ error: "Invalid token: " + error.message });
      return;
    }
    
    if (!user) {
      console.log('No user found for token');
      res.status(401).json({ error: "No user found for token" });
      return;
    }
    
    console.log('User validated:', { id: user.id, email: user.email });
    
    // Check if user exists in our database, if not create them
    let localUser = await getUserById(user.id);
    console.log('Local user lookup result:', localUser);
    
    if (!localUser) {
      // Create user in our database
      const username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
      console.log('Creating new user in local database with data:', {
        id: user.id,
        email: user.email || '',
        username: username,
        avatarUrl: user.user_metadata?.avatar_url || null,
      });
      
      localUser = await createUser({
        id: user.id,
        email: user.email || '',
        username: username,
        avatarUrl: user.user_metadata?.avatar_url || null,
      });
      
      console.log('Created new user in local database:', localUser);
    }
    
    // Attach user to request
    (req as any).user = localUser;
    console.log('Attached user to request, proceeding to next middleware');
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(500).json({ error: "Authentication error" });
    return;
  }
}