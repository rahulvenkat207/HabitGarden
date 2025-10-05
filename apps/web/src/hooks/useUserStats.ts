import { useMemo } from 'react';
import { useStore } from '@/state/useStore';

interface UserStats {
  totalHabits: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

export const useUserStats = (): UserStats => {
  const habits = useStore(state => state.habits);
  
  return useMemo(() => {
    const totalHabits = habits.length;
    
    // Calculate current streak (max streak among all habits)
    const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
    
    // Calculate longest streak ever achieved
    const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
    
    // Calculate total completions
    const totalCompletions = habits.reduce((sum, habit) => {
      return sum + (habit.completionHistory?.length || 0);
    }, 0);
    
    // Calculate completion rate (total completions / possible completions)
    const totalPossibleCompletions = habits.reduce((sum, habit) => {
      if (!habit.createdAt) return sum;
      
      const createdDate = new Date(habit.createdAt);
      const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + daysSinceCreation;
    }, 0);
    
    const completionRate = totalPossibleCompletions > 0 
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100) 
      : 0;
    
    return {
      totalHabits,
      currentStreak,
      longestStreak,
      totalCompletions,
      completionRate
    };
  }, [habits]);
};