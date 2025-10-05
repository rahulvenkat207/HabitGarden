import { Header } from '@/components/Header';
import { GardenPlant } from '@/components/GardenPlant';
import { useStore } from '@/state/useStore';
import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List, Sprout, TreePine, Flower2 } from 'lucide-react';
import HabitCarousel from '@/components/HabitCarousel';
import { CarouselSlide } from '@/components/HabitCarousel';

const Garden = () => {
  const { habits, getGrowthState } = useStore();

  // Create carousel slides for garden highlights
  const carouselSlides: CarouselSlide[] = [
    {
      id: '1',
      title: 'Garden Overview',
      text: 'You have 5 flourishing plants in your garden. Keep nurturing them!',
      icon: '🌿',
      variant: 'plant'
    },
    {
      id: '2',
      title: 'Top Bloomer',
      text: '"Morning Meditation" is your most consistent habit with a 12-day streak!',
      icon: '🧘',
      variant: 'plant'
    },
    {
      id: '3',
      title: 'Growth Insight',
      text: 'Your garden has grown 40% in the last month. Amazing progress!',
      icon: '📈',
      variant: 'stats'
    },
    {
      id: '4',
      title: 'Gardener Tip',
      text: 'Consistency beats intensity. Small daily actions create lasting change.',
      icon: '💡',
      variant: 'quote'
    },
    {
      id: '5',
      title: 'New Sprout',
      text: 'Your newest habit "Evening Journal" is just beginning to grow. Keep going!',
      icon: '🌱',
      variant: 'plant'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-sky relative overflow-hidden">
      {/* Enhanced multi-tone gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(120_35%_96%)] via-[hsl(135_30%_93%)] to-[hsl(142_35%_90%)]" />
      
      {/* Ambient sunlight rays */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ 
          background: 'radial-gradient(ellipse at top left, hsl(142_50%_95%) 0%, transparent 50%)',
        } as React.CSSProperties}
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0]
        }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating leaf particles with improved parallax effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-15"
        animate={{ 
          y: [0, -30, 0],
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-15"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 4) * 20}%`,
            } as React.CSSProperties}
            animate={{
              y: [0, -40, 0],
              rotate: [-10, 10, -10],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          >
            {i % 3 === 0 ? '🍃' : i % 3 === 1 ? '🌿' : '🍀'}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Subtle vine shapes at low opacity */}
      <motion.div 
        className="absolute inset-0 opacity-05"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0v100h100V0H0zm50 25c13.8 0 25 11.2 25 25s-11.2 25-25 25S25 63.8 25 50s11.2-25 25-25z' fill='%238ACB88' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        } as React.CSSProperties}
        animate={{
          x: [0, -20, 0],
          y: [0, 10, 0]
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <motion.h1 
              className="text-4xl font-bold mb-2 bg-gradient-header bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Garden
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Watch your habits grow and flourish
            </motion.p>
          </div>

          <div className="flex justify-center mb-8">
            <Link to="/habits">
              <Button 
                variant="outline"
                size="lg"
                className="shadow-soft hover:shadow-glow"
              >
                <List className="mr-2 h-5 w-5" />
                View Habits List
              </Button>
            </Link>
          </div>

          {/* Garden Highlights Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <HabitCarousel slides={carouselSlides} className="py-4" />
          </motion.div>

          {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🏡</div>
            <h2 className="text-2xl font-semibold mb-4">Your garden awaits</h2>
            <p className="text-muted-foreground">Start planting habits to see your garden come to life</p>
          </motion.div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GardenPlant 
                  habit={habit}
                  growthState={getGrowthState(habit)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Garden Stats */}
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid gap-6 md:grid-cols-3 max-w-3xl mx-auto"
          >
            <StatCard
              icon="🌱"
              label="Total Plants"
              value={habits.length}
            />
            <StatCard
              icon="🔥"
              label="Total Streak Days"
              value={habits.reduce((sum, h) => sum + h.streak, 0)}
            />
            <StatCard
              icon="🌸"
              label="Blooming"
              value={habits.filter(h => getGrowthState(h) === 'bloom').length}
            />
          </motion.div>
        )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <motion.div 
    className="bg-card p-6 rounded-2xl shadow-soft text-center relative overflow-hidden"
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="absolute inset-0 bg-gradient-glow opacity-0 hover:opacity-20 transition-opacity duration-300" />
    <div className="text-4xl mb-2">{icon}</div>
    <motion.div 
      className="text-3xl font-bold mb-1"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {value}
    </motion.div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

export default Garden;