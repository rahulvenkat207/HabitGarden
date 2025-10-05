import { getAuthConfig } from './auth-utils';
import { supabase } from './supabaseClient';

// Define the base URL for the API
// Use the deployed backend URL in production, fallback to localhost in development
// Get the API base URL using our helper function
const API_BASE_URL = getApiBaseUrl();

// Add a function to get the correct API base URL
export function getApiBaseUrl(): string {
  // In production, use the environment variable or fallback to the deployed backend
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://rare-integrity-production.up.railway.app';
  }
  // In development, use the environment variable or fallback to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
}

// Define types for our API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HabitResponse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  frequency?: {
    days?: string[];
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressResponse {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

// Add a new type for the heatmap response
export type ProgressHeatmapResponse = Record<string, boolean>;

export interface StreakResponse {
  id: string;
  habitId: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastChecked?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth service - uses Supabase directly for authentication
class AuthService {
  async signin(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            error: `Please check your email (${email}) and click the confirmation link to activate your account. Check your spam folder if you don't see it.`
          };
        }
        return {
          success: false,
          error: error.message
        };
      }
      
      if (data?.session?.access_token) {
        return {
          success: true,
          data: { token: data.session.access_token }
        };
      } else {
        return {
          success: false,
          error: 'Signin failed. Please try again.'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Signin failed. Please check your credentials and try again.'
      };
    }
  }

  async signup(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      // For signup, Supabase might not return a session immediately
      return {
        success: true,
        message: `We've sent a confirmation email to ${email}. Please check your inbox (and spam folder) to confirm your account.`,
        data: { token: data?.session?.access_token || '' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  }
  
  async signout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Signout failed'
      };
    }
  }
  
  // Get current session
  async getSession() {
    return await supabase.auth.getSession();
  }
  
  // Get user
  async getUser() {
    return await supabase.auth.getUser();
  }
  
  // Listen for auth state changes
  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Base service class for handling authenticated requests to our backend API
class BaseService {
  protected async authenticatedRequest(url: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token found');
    }
    
    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

// Habits service - communicates with our backend API
class HabitsService extends BaseService {
  async getHabits(): Promise<ApiResponse<HabitResponse[]>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/habits`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch habits'
      };
    }
  }

  async createHabit(habit: { title: string; description?: string; category?: string; color?: string; frequency?: { days?: string[] } }): Promise<ApiResponse<HabitResponse>> {
    try {
      // Map the frontend habit data to match backend expectations
      const backendHabit = {
        title: habit.title,
        description: habit.description || '',
        category: habit.category || 'general',
        color: habit.color || '#16a34a', // Default green color
        frequency: habit.frequency || { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
      };
      
      const response = await this.authenticatedRequest(`${API_BASE_URL}/habits`, {
        method: 'POST',
        body: JSON.stringify(backendHabit),
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create habit'
      };
    }
  }

  async updateHabit(id: string, habit: Partial<{ title: string; description?: string; category?: string; color?: string; frequency?: { days?: string[] } }>): Promise<ApiResponse<HabitResponse>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/habits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(habit),
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update habit'
      };
    }
  }

  async deleteHabit(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/habits/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete habit'
      };
    }
  }
}

// Progress service - communicates with our backend API
class ProgressService extends BaseService {
  async getProgress(habitId: string): Promise<ApiResponse<ProgressHeatmapResponse>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/progress/${habitId}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch progress'
      };
    }
  }

  async markProgress(habitId: string, date: string): Promise<ApiResponse<ProgressResponse>> {
    try {
      console.log('Making markProgress request with:', { habitId, date });
      const response = await this.authenticatedRequest(`${API_BASE_URL}/progress/${habitId}`, {
        method: 'POST',
        body: JSON.stringify({ date }),
      });
      console.log('markProgress response:', response);
      return response;
    } catch (error: any) {
      console.error('markProgress error:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark progress'
      };
    }
  }

  async unmarkProgress(habitId: string, date: string): Promise<ApiResponse<null>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/progress/${habitId}/${date}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to unmark progress'
      };
    }
  }
}

// Streaks service - communicates with our backend API
class StreaksService extends BaseService {
  async getStreak(habitId: string): Promise<ApiResponse<StreakResponse>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/streaks/${habitId}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch streak'
      };
    }
  }

  async checkStreak(habitId: string): Promise<ApiResponse<StreakResponse>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/streaks/${habitId}/check`, {
        method: 'POST',
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to check streak'
      };
    }
  }

  async resetStreak(habitId: string): Promise<ApiResponse<StreakResponse>> {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/streaks/${habitId}`, {
        method: 'PUT',
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to reset streak'
      };
    }
  }
}

// Export service instances
export const authService = new AuthService();
export const habitsService = new HabitsService();
export const progressService = new ProgressService();
export const streaksService = new StreaksService();

// Export Supabase client for direct usage if needed
export { supabase };