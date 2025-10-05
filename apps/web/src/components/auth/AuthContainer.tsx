import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import React from 'react';

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Parallax effect for background elements
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      
      gsap.to(containerRef.current.querySelectorAll('.parallax-element'), {
        duration: 0.5,
        x: xAxis,
        y: yAxis,
        ease: 'power2.out'
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #EAF4EA 0%, #F8FFF8 100%)'
      } as React.CSSProperties}
    >
      {/* Floating background leaves */ }
      <motion.div 
        className="parallax-element absolute top-10 left-10 text-5xl opacity-10"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🍃
      </motion.div>
      
      <motion.div 
        className="parallax-element absolute top-1/3 right-20 text-6xl opacity-10"
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        🌿
      </motion.div>
      
      <motion.div 
        className="parallax-element absolute bottom-20 left-1/4 text-4xl opacity-10"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        🌱
      </motion.div>
      
      <motion.div 
        className="parallax-element absolute bottom-1/3 right-1/3 text-5xl opacity-10"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        🍀
      </motion.div>
      
      {children}
    </div>
  );
};