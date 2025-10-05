import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Leaf } from 'lucide-react';
import { useStore } from '@/state/useStore';
import { Button } from '@/components/ui/button';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitModal } from '@/components/AddHabitModal';
import HabitCarousel from '@/components/HabitCarousel';
import { CarouselSlide } from '@/components/HabitCarousel';
import { Header } from '@/components/Header'; // Add this import

export const Habits = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { habits, loading, error, loadHabits, checkinHabit, addHabit } = useStore();

  // Load habits when component mounts
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Create carousel slides for habit stats and motivational quotes
  const carouselSlides: CarouselSlide[] = [
    {
      id: '1',
      title: 'Your Top Streak',
      text: 'Keep going! Your longest streak is 12 days. You\'re doing amazing!',
      icon: '🔥',
      variant: 'stats'
    },
    {
      id: '2',
      title: 'Morning Meditation',
      text: '7-day streak - Consistency is building your mindfulness muscle!',
      icon: '🧘',
      variant: 'plant'
    },
    {
      id: '3',
      title: 'Daily Reading',
      text: '12-day streak - Knowledge is growing with every page!',
      icon: '📚',
      variant: 'plant'
    },
    {
      id: '4',
      title: 'Motivational Quote',
      text: '"Small consistent actions lead to remarkable results."',
      icon: '💬',
      variant: 'quote'
    },
    {
      id: '5',
      title: 'Weekly Achievement',
      text: 'You\'ve completed 21 habits this week! 🌟',
      icon: '🏆',
      variant: 'achievement'
    },
  ];

  // Show loading state
  if (loading && habits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Habits</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadHabits} className="bg-green-600 hover:bg-green-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header /> {/* Add the Header component */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Habits</h1>
            <p className="text-gray-600">Cultivate positive routines daily</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </div>
        </motion.div>

        {/* Stats Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <HabitCarousel slides={carouselSlides} className="py-4" />
        </motion.div>

        {/* Habits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {habits.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-green-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Habits Yet</h2>
              <p className="text-gray-600 mb-6">Start by adding your first habit to begin your journey</p>
              <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <HabitCard habit={habit} onCheckin={checkinHabit} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AddHabitModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={addHabit} 
      />
    </div>
  );
};