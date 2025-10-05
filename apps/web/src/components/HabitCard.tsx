import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Flame, Sparkles, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Habit } from '@/state/useStore';
import confetti from 'canvas-confetti';
import HabitProgress from '@/components/HabitProgress';

interface HabitCardProps {
  habit: Habit;
  onCheckin: (id: string) => void;
}

export const HabitCard = ({ habit, onCheckin }: HabitCardProps) => {
  const [isWatering, setIsWatering] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  const handleWater = async () => {
    const now = new Date();
    const lastCheckin = habit.lastCheckin ? new Date(habit.lastCheckin) : null;
    const isToday = lastCheckin && lastCheckin.toDateString() === now.toDateString();
    
    if (isToday) return;
    
    setIsWatering(true);
    setIsCelebrating(true);
    
    try {
      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A3D9A5', '#78C57A', '#F4EAD5', '#FFD700']
      });
      
      await onCheckin(habit.id);
    } catch (error) {
      console.error('Error checking in habit:', error);
      // You could add a toast notification here to show the error to the user
    } finally {
      setTimeout(() => {
        setIsWatering(false);
        setIsCelebrating(false);
      }, 1200);
    }
  };
  
  // Ripple effect when clicking the water button
  const createRipple = (event: React.MouseEvent) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
  };
  
  const progress = Math.min((habit.streak / 30) * 100, 100);
  const isWateredToday = habit.lastCheckin && 
    new Date(habit.lastCheckin).toDateString() === new Date().toDateString();
  
  const getGrowthStage = () => {
    if (habit.streak >= 21) return 'bloom';
    if (habit.streak >= 14) return 'growing';
    if (habit.streak >= 7) return 'small';
    return 'sprout';
  };
  
  const growthStage = getGrowthStage();
  
  const cardBgClass = {
    sprout: 'bg-[hsl(var(--sprout-bg))]',
    small: 'bg-[hsl(var(--small-bg))]',
    growing: 'bg-[hsl(var(--small-bg))]',
    bloom: 'bg-[hsl(var(--bloom-bg))]'
  }[growthStage];
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isCelebrating ? [1, 1.05, 1] : 1
        }}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="transition-smooth cursor-pointer"
        onClick={() => setShowProgress(true)}
      >
        <Card className={`p-6 shadow-soft hover:shadow-float transition-all duration-300 ${cardBgClass} ${isCelebrating ? 'shadow-celebration' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{habit.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{habit.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div
                    animate={{ scale: isCelebrating ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Flame className="h-4 w-4 text-accent" />
                  </motion.div>
                  <motion.span 
                    key={habit.streak}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-sm text-muted-foreground font-medium"
                  >
                    {habit.streak}-day streak
                  </motion.span>
                  {habit.streak >= 7 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Sparkles className="h-3 w-3 text-accent" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProgress(true);
                }}
              >
                <BarChart className="h-4 w-4" />
              </Button>
              
              <motion.div
                animate={isWatering ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                className="relative"
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    createRipple(e);
                    handleWater();
                  }}
                  disabled={isWateredToday}
                  className="h-12 w-12 rounded-full p-0 shadow-soft hover:shadow-glow relative overflow-hidden"
                  variant={isWateredToday ? "secondary" : "default"}
                >
                  <motion.div
                    animate={isWatering ? { y: [0, -3, 0] } : {}}
                    transition={{ repeat: isWatering ? 2 : 0, duration: 0.3 }}
                  >
                    <Droplet className={`h-5 w-5 ${isWateredToday ? 'fill-current' : ''}`} />
                  </motion.div>
                </Button>
                
                {isWatering && (
                  <>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{ 
                          scale: 1,
                          x: Math.cos(i * 60 * Math.PI / 180) * 40,
                          y: Math.sin(i * 60 * Math.PI / 180) * 40,
                          opacity: 0
                        }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground font-medium">
              <span>Progress</span>
              <span>{habit.streak} / 30 days</span>
            </div>
            
            <div className="h-3 bg-muted rounded-full overflow-hidden relative">
              {/* Background gradient for progress bar */}
              <div className="absolute inset-0 bg-gradient-progress rounded-full opacity-20" />
              
              {/* Animated progress bar with gradient */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-progress rounded-full relative"
              >
                {/* Moving leaf icon that travels along the progress bar */}
                {progress > 10 && (
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-xs"
                    animate={{
                      x: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🍃
                  </motion.div>
                )}
              </motion.div>
              
              {/* Growth milestones */}
              <div className="absolute inset-0 flex items-center justify-between px-1">
                {[7, 14, 21, 28].map((milestone) => (
                  <div 
                    key={milestone}
                    className={`w-1 h-1 rounded-full ${habit.streak >= milestone ? 'bg-success' : 'bg-muted-foreground/30'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Growth stage indicator */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>🌱 Sprout</span>
              <span>🌳 Bloom</span>
            </div>
          </div>
        </Card>
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