import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, habitsService, progressService, streaksService, type HabitResponse, type ProgressHeatmapResponse, type StreakResponse } from '@/lib/api';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  lastCheckin?: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completionHistory?: string[]; // Array of dates when the habit was completed
}

interface AuthState {
  isAuthenticated: boolean | null; // Changed to nullable to handle initial state
  user: {
    email: string;
    displayName: string;
    avatarUrl?: string;
  } | null;
  signin: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>; // Add this new method
}

interface HabitStore extends AuthState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  addHabit: (habit: { name: string; icon: string; frequency: 'daily' | 'weekly' }) => Promise<void>;
  checkinHabit: (id: string) => Promise<void>;
  loadHabits: () => Promise<void>;
  getGrowthState: (habit: Habit) => 'sprout' | 'small' | 'bloom' | 'wilted';
  getHabitCompletionHistory: (habit: Habit) => string[]; // New method to get completion history
}

// Helper function to convert backend habit to frontend habit
const convertHabit = (habitResponse: HabitResponse, progressData: ProgressHeatmapResponse, streakData?: StreakResponse): Habit => {
  // Convert heatmap object to completion history array
  const completionHistory = progressData 
    ? Object.entries(progressData)
        .filter(([date, completed]) => completed)
        .map(([date, completed]) => date)
    : [];
  
  // Determine frequency based on days array
  let frequency: 'daily' | 'weekly' = 'daily';
  if (habitResponse.frequency?.days) {
    // If all 7 days are present, it's daily; otherwise, it's weekly
    frequency = habitResponse.frequency.days.length === 7 ? 'daily' : 'weekly';
  }
  
  return {
    id: habitResponse.id,
    name: habitResponse.title,
    icon: habitResponse.category === 'general' ? '🌱' : 
          habitResponse.category === 'health' ? '💪' : 
          habitResponse.category === 'mindfulness' ? '🧘' : 
          habitResponse.category === 'learning' ? '📚' : '🌱',
    streak: streakData?.currentStreak || 0,
    lastCheckin: streakData?.lastChecked,
    frequency: frequency,
    createdAt: habitResponse.createdAt,
    completionHistory
  };
};

export const useStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      // Auth state - initialize as null to indicate unknown state
      isAuthenticated: null,
      user: null,
      loading: false,
      error: null,
      modalOpen: false,
      habits: [], // Initialize habits array
      
      signin: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.signin(email, password);
          if (response.success && response.data?.token) {
            // Get user info after successful signin
            const userResponse = await authService.getUser();
            if (userResponse.data?.user) {
              const user = userResponse.data.user;
              set({ 
                isAuthenticated: true,
                user: {
                  email: user.email || '',
                  displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                  avatarUrl: user.user_metadata?.avatar_url || undefined
                },
                loading: false 
              });
            } else {
              set({ 
                isAuthenticated: true,
                user: {
                  email: email,
                  displayName: email.split('@')[0],
                },
                loading: false 
              });
            }
            // Load habits after successful signin
            await get().loadHabits();
            return true;
          } else {
            throw new Error(response.error || 'Signin failed');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Signin failed. Please check your credentials.';
          set({ 
            error: errorMessage, 
            loading: false 
          });
          return false;
        }
      },
      
      signup: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.signup(email, password);
          if (response.success) {
            // Check if we got a token immediately (email confirmation disabled)
            if (response.data?.token) {
              // User can sign in immediately
              set({ 
                loading: false
              });
              // Show success message and prompt user to sign in
              set({ 
                error: 'Account created successfully! Please sign in with your credentials.'
              });
              // Clear the success message after 3 seconds
              setTimeout(() => {
                set({ error: null });
              }, 3000);
              return true;
            } else {
              // For signup, we show a success message
              set({ 
                loading: false
              });
              // Set a more informative success message
              const successMessage = response.message || 'Account created successfully! Please sign in with your credentials.';
              set({ 
                error: successMessage
              });
              // Clear the success message after 3 seconds
              setTimeout(() => {
                set({ error: null });
              }, 3000);
              return true;
            }
          } else {
            throw new Error(response.error || 'Signup failed');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Signup failed. Please try again.', 
            loading: false 
          });
          return false;
        }
      },
      
      signout: async () => {
        try {
          await authService.signout();
          set({ 
            isAuthenticated: false,
            user: null,
            habits: []
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Signout failed'
          });
        }
      },
      
      // New method to check authentication status
      checkAuthStatus: async () => {
        try {
          const { data: { session } } = await authService.getSession();
          if (session?.access_token) {
            // Get user info
            const userResponse = await authService.getUser();
            if (userResponse.data?.user) {
              const user = userResponse.data.user;
              set({ 
                isAuthenticated: true,
                user: {
                  email: user.email || '',
                  displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                  avatarUrl: user.user_metadata?.avatar_url || undefined
                }
              });
            } else {
              set({ isAuthenticated: true });
            }
            return true;
          } else {
            set({ isAuthenticated: false, user: null });
            return false;
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          set({ isAuthenticated: false, user: null });
          return false;
        }
      },
      
      setModalOpen: (open) => set({ modalOpen: open }),
      
      loadHabits: async () => {
        set({ loading: true, error: null });
        try {
          // Fetch habits
          const habitsResponse = await habitsService.getHabits();
          if (!habitsResponse.success || !habitsResponse.data) {
            throw new Error(habitsResponse.error || 'Failed to load habits');
          }
          
          // Fetch progress and streak data for each habit
          const habitsWithDetails = await Promise.all(
            habitsResponse.data.map(async (habit) => {
              // Fetch progress data
              const progressResponse = await progressService.getProgress(habit.id);
              const progressData = progressResponse.success ? progressResponse.data || {} : {};
              
              // Fetch streak data
              const streakResponse = await streaksService.getStreak(habit.id);
              const streakData = streakResponse.success ? streakResponse.data : undefined;
              
              return convertHabit(habit, progressData, streakData);
            })
          );
          
          set({ 
            habits: habitsWithDetails, 
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to load habits', 
            loading: false 
          });
        }
      },
      
      addHabit: async (habitData) => {
        set({ loading: true, error: null });
        try {
          // Map frontend habit data to backend format
          const backendHabit = {
            title: habitData.name,
            description: '', // Add description field
            category: 'general', // Add category field
            color: '#16a34a', // Add color field
            frequency: habitData.frequency === 'daily' ? 
              { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] } : 
              { days: ['monday', 'wednesday', 'friday'] } // Default to MWF for weekly
          };
          
          const response = await habitsService.createHabit(backendHabit);
          if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to create habit');
          }
          
          // Convert and add the new habit to the store
          const newHabit = convertHabit(response.data, {});
          set(state => ({ 
            habits: [...state.habits, newHabit], 
            loading: false 
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to create habit', 
            loading: false 
          });
        }
      },

      checkinHabit: async (id) => {
        const { habits } = get();
        set({ loading: true, error: null });
        try {
          console.log('Checking in habit with ID:', id);
          
          // Mark progress for today
          const today = new Date().toISOString().split('T')[0];
          console.log('Today\'s date:', today);
          
          const progressResponse = await progressService.markProgress(id, today);
          console.log('Progress response:', progressResponse);
          
          if (!progressResponse.success) {
            throw new Error(progressResponse.error || 'Failed to check in habit');
          }
          
          // Check streak
          const streakResponse = await streaksService.checkStreak(id);
          console.log('Streak response:', streakResponse);
          
          if (!streakResponse.success || !streakResponse.data) {
            throw new Error(streakResponse.error || 'Failed to update streak');
          }
          
          // Update the habit in the store
          const updatedHabits = habits.map(habit => {
            if (habit.id === id) {
              // Ensure completionHistory is an array
              const currentHistory = Array.isArray(habit.completionHistory) ? habit.completionHistory : [];
              const newCompletionHistory = [...currentHistory, today];
              
              return {
                ...habit,
                streak: streakResponse.data.currentStreak,
                lastCheckin: streakResponse.data.lastChecked,
                completionHistory: newCompletionHistory
              };
            }
            return habit;
          });
          
          set({ 
            habits: updatedHabits, 
            loading: false 
          });
        } catch (error: any) {
          console.error('Error checking in habit:', error);
          set({ 
            error: error.message || 'Failed to check in habit', 
            loading: false 
          });
        }
      },

      getGrowthState: (habit) => {
        const daysSinceLastCheckin = habit.lastCheckin
          ? Math.floor((Date.now() - new Date(habit.lastCheckin).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        
        // Wilted state if not checked in for more than 2 days
        if (daysSinceLastCheckin > 2) return 'wilted';
        
        // Enhanced growth stages with visual cues
        if (habit.streak >= 15) return 'bloom'; // Rare flower 🌺 or Tree 🌳
        if (habit.streak >= 8) return 'bloom';  // Blooming flower 🌸
        if (habit.streak >= 4) return 'small';  // Small plant 🌿
        return 'sprout';                       // Tiny sprout 🌱
      },
      
      getHabitCompletionHistory: (habit) => {
        return habit.completionHistory || [];
      }
    }),
    {
      name: 'habit-store',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        habits: state.habits
      }),
    }
  )
);