import { motion } from 'framer-motion';
import { Habit } from '@/state/useStore';
import React, { useState } from 'react';
import HabitProgress from '@/components/HabitProgress';

interface GardenPlantProps {
  habit: Habit;
  growthState: 'sprout' | 'small' | 'bloom' | 'wilted';
}

export const GardenPlant = ({ habit, growthState }: GardenPlantProps) => {
  const [showProgress, setShowProgress] = useState(false);
  
  const getPlantSize = () => {
    switch (growthState) {
      case 'sprout':
        return { scale: 0.7, height: 70 };
      case 'small':
        return { scale: 0.9, height: 90 };
      case 'bloom':
        return { scale: 1.2, height: 110 };
      case 'wilted':
        return { scale: 0.75, height: 70 };
    }
  };

  const size = getPlantSize();
  const isWilted = growthState === 'wilted';
  
  // Get background color based on growth stage
  const getCardBackground = () => {
    switch (growthState) {
      case 'sprout':
        return 'bg-[hsl(var(--sprout-bg))]';
      case 'small':
        return 'bg-[hsl(var(--small-bg))]';
      case 'bloom':
        return 'bg-[hsl(var(--bloom-bg))]';
      case 'wilted':
        return 'bg-[hsl(var(--wilted-bg))]';
      default:
        return 'bg-card';
    }
  };
  
  // Get plant emoji based on growth stage
  const getPlantEmoji = () => {
    if (growthState === 'wilted') return '💧';
    if (habit.streak >= 15) return '🌳';  // Tree for 15+ days
    if (habit.streak >= 8) return '🌸';  // Flower for 8-14 days
    if (habit.streak >= 4) return '🌿';  // Small plant for 4-7 days
    return '🌱';                        // Sprout for 0-3 days
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: size.scale,
        }}
        whileHover={{ 
          y: -8, 
          scale: size.scale * 1.05,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 3px 12px rgba(0, 0, 0, 0.04)'
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className={`flex flex-col items-center gap-4 p-6 ${getCardBackground()} rounded-2xl shadow-card transition-all duration-300 relative overflow-hidden cursor-pointer`}
        onClick={() => setShowProgress(true)}
      >
        {/* Soil base for subtle depth illusion */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-gradient-earth rounded-full opacity-30 blur-sm" />
        
        <motion.div
          animate={isWilted ? { rotate: [0, -5, 5, -5, 0] } : { rotate: [-2, 2, -2] }}
          transition={{
            duration: isWilted ? 0.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
          style={{ height: size.height } as React.CSSProperties}
          whileHover={{
            scale: 1.1,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          }}
        >
          {/* Plant pot with enhanced gradient */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="w-16 h-10 bg-gradient-earth rounded-b-lg relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-accent/30" />
            </div>
          </div>

          {/* Plant stem and leaves with improved animations */}
          <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 ${isWilted ? 'opacity-50' : ''}`}>
            <motion.div
              animate={{ scaleY: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-12 bg-success/90 rounded-t-full mx-auto"
            />
            
            {/* Leaves with enhanced animation */}
            <div className="relative -mt-8">
              <motion.div
                animate={{ rotate: isWilted ? -30 : [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -left-4 w-6 h-4 bg-primary rounded-full transform -rotate-45"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div
                animate={{ rotate: isWilted ? 30 : [5, -5, 5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-4 w-6 h-4 bg-primary rounded-full transform rotate-45"
                whileHover={{ scale: 1.2 }}
              />
            </div>
          </div>

          {/* Flower or icon on top with spring bounce animation */}
          <motion.div
            animate={{ 
              y: isWilted ? 10 : [0, -8, 0],
              rotate: isWilted ? 20 : 0,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-4xl"
            whileHover={{
              scale: 1.3,
              rotate: [0, -10, 10, 0],
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 10
              }
            }}
          >
            {getPlantEmoji()}
          </motion.div>
        </motion.div>

        {/* Habit info with improved typography */}
        <div className="text-center space-y-1 w-full">
          <h3 className="font-semibold text-base text-foreground">{habit.name}</h3>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              🔥
            </motion.span>
            <span className="font-medium">{habit.streak} days</span>
          </div>
        </div>

        {/* Growth indicator with animated background gradient when habit grows */}
        <motion.div 
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            growthState === 'bloom' ? 'bg-gradient-bloom text-white' :
            growthState === 'wilted' ? 'bg-destructive/20 text-destructive-foreground' :
            'bg-primary/20 text-primary-foreground'
          }`}
          animate={growthState === 'bloom' ? {
            background: [
              'linear-gradient(135deg, hsl(340 65% 75%) 0%, hsl(350 60% 68%) 50%, hsl(358 70% 72%) 100%)',
              'linear-gradient(135deg, hsl(358 70% 72%) 0%, hsl(340 65% 75%) 50%, hsl(350 60% 68%) 100%)',
              'linear-gradient(135deg, hsl(340 65% 75%) 0%, hsl(350 60% 68%) 50%, hsl(358 70% 72%) 100%)'
            ]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {growthState === 'bloom' && habit.streak >= 15 && '🌳 Rare Bloom'}
          {growthState === 'bloom' && habit.streak >= 8 && habit.streak < 15 && '🌸 Blooming'}
          {growthState === 'small' && '🌿 Growing'}
          {growthState === 'sprout' && '🌱 Sprouting'}
          {growthState === 'wilted' && '💧 Needs water'}
        </motion.div>
        
        {/* Growth meter showing progress to next stage */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-progress rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(100, (habit.streak % 7) * 14.3)}%` 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-muted-foreground w-full text-center">
          {growthState === 'sprout' && `Next: 🌿 in ${7 - habit.streak} days`}
          {growthState === 'small' && `Next: 🌸 in ${15 - habit.streak} days`}
          {growthState === 'bloom' && habit.streak < 15 && `Next: 🌳 in ${15 - habit.streak} days`}
          {growthState === 'bloom' && habit.streak >= 15 && "Maximum bloom reached!"}
          {growthState === 'wilted' && "Water needed to continue growth"}
        </div>
      </motion.div>
      
      {/* Habit Progress Modal */}
      {showProgress && (
        <HabitProgress 
          habit={habit} 
          onClose={() => setShowProgress(false)} 
        />
      )}
    </>
  );
};