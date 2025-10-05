import { Habit } from '@/state/useStore';

interface HeatmapDay {
  date: string;
  completed: boolean;
  streak: number;
}

export const useHabitHeatmap = (habit: Habit) => {
  const generateHeatmapData = (): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    
    try {
      // Use the habit's completion history
      const completionHistory = habit.completionHistory || [];
      
      // Create a Set for faster lookup
      const completedDates = new Set(completionHistory);
      
      // Generate data for the last 60 days
      for (let i = 59; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Format date as YYYY-MM-DD
        const dateStr = date.toISOString().split('T')[0];
        
        // Check if this date is in the completion history
        const isCompleted = completedDates.has(dateStr);
        
        // For streak calculation, we'll use a simplified approach
        // In a real app, you might want to calculate actual streaks
        const streak = isCompleted ? Math.min(habit.streak, 10) : 0;
        
        data.push({
          date: dateStr,
          completed: isCompleted,
          streak: streak
        });
      }
    } catch (error) {
      console.error('Error generating heatmap data:', error);
      // Return empty array if there's an error
      return [];
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();
  
  // Group data by weeks for the heatmap
  const groupDataByWeeks = () => {
    const weeks = [];
    try {
      for (let i = 0; i < heatmapData.length; i += 7) {
        weeks.push(heatmapData.slice(i, i + 7));
      }
    } catch (error) {
      console.error('Error grouping heatmap data:', error);
      return [];
    }
    return weeks;
  };
  
  const weeklyData = groupDataByWeeks();
  
  // Calculate stats
  const totalCompletions = heatmapData.filter(day => day.completed).length;
  const successRate = heatmapData.length > 0 ? Math.round((totalCompletions / heatmapData.length) * 100) : 0;
  
  // Get color class based on streak
  const getStreakColor = (day: HeatmapDay) => {
    if (!day.completed) return 'bg-gray-200';
    if (day.streak >= 7) return 'bg-green-600';
    if (day.streak >= 3) return 'bg-green-500';
    return 'bg-green-400';
  };

  return {
    heatmapData,
    weeklyData,
    totalCompletions,
    successRate,
    getStreakColor
  };
};