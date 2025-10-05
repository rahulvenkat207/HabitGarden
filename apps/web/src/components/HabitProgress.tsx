import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Habit } from '@/state/useStore';
import { useHabitHeatmap } from '@/hooks/useHabitHeatmap';

interface HabitProgressProps {
  habit: Habit;
  onClose: () => void;
}

const HabitProgress = ({ habit, onClose }: HabitProgressProps) => {
  const { weeklyData, totalCompletions, successRate, getStreakColor } = useHabitHeatmap(habit);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{habit.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="font-semibold">{habit.streak}-day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">{totalCompletions} completed</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Stats Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-green-700 font-medium">Total Completions</div>
              <div className="text-2xl font-bold text-green-900">{totalCompletions}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-sm text-blue-700 font-medium">Success Rate</div>
              <div className="text-2xl font-bold text-blue-900">{successRate}%</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-sm text-purple-700 font-medium">Current Streak</div>
              <div className="text-2xl font-bold text-purple-900">{habit.streak} days</div>
            </div>
          </div>
          
          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl mb-8 text-center">
            <p className="text-lg font-medium text-gray-800">
              {successRate >= 80 
                ? "You've been consistent! Keep up the great work 🌻" 
                : successRate >= 60 
                  ? "You're doing well! Consistency is key 🌱" 
                  : "Keep going! Every day counts towards your goal 🌿"}
            </p>
          </div>
          
          {/* Heatmap */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">60-Day Progress</h3>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Weekday labels */}
                <div className="flex mb-2">
                  <div className="w-8"></div> {/* Spacer for weekday labels */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap grid */}
                <div className="space-y-2">
                  {weeklyData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex">
                      <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">
                        {weekIndex === 0 && 'W1'}
                        {weekIndex === 4 && 'W2'}
                        {weekIndex === 8 && 'W3'}
                        {weekIndex === 12 && 'W4'}
                        {weekIndex === 16 && 'W5'}
                        {weekIndex === 20 && 'W6'}
                        {weekIndex === 24 && 'W7'}
                        {weekIndex === 28 && 'W8'}
                      </div>
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-8 h-8 rounded-sm m-0.5 ${getStreakColor(day)} transition-all hover:scale-110 cursor-pointer`}
                          title={`${day.date}: ${day.completed ? 'Completed' : 'Missed'}`}
                        />
                      ))}
                      {/* Fill empty days for incomplete weeks */}
                      {week.length < 7 && 
                        Array(7 - week.length)
                          .fill(0)
                          .map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8 m-0.5"></div>
                          ))
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
              <span className="text-sm text-gray-600">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
              <span className="text-sm text-gray-600">1-2 days streak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">3-6 days streak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
              <span className="text-sm text-gray-600">7+ days streak</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HabitProgress;