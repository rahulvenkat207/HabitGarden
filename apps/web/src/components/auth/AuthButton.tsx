import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AuthButton = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}: AuthButtonProps) => {
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick();
  };
  
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative overflow-hidden rounded-lg py-6 px-8 text-lg font-semibold
          bg-green-600 hover:bg-green-700 text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          transition-all duration-300 ${className}
          ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            } as React.CSSProperties}
            initial={{ 
              width: 0, 
              height: 0,
              opacity: 0.7,
              x: -ripple.x,
              y: -ripple.y,
            }}
            animate={{ 
              width: 300, 
              height: 300,
              opacity: 0,
              x: -ripple.x - 150,
              y: -ripple.y - 150,
            }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => {
              setRipples(prev => prev.filter(r => r.id !== ripple.id));
            }}
          />
        ))}
        
        {children}
      </Button>
    </motion.div>
  );
};