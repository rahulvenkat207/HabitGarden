import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import React from 'react';

interface AnimatedLeafProps {
  className?: string;
  emoji: string;
  delay?: number;
}

export const AnimatedLeaf = ({ 
  className = '', 
  emoji, 
  delay = 0 
}: AnimatedLeafProps) => {
  const leafRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!leafRef.current) return;
    
    // Initial floating animation
    gsap.to(leafRef.current, {
      y: -20,
      rotation: 10,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: delay
    });
    
    // Gentle horizontal movement
    gsap.to(leafRef.current, {
      x: 10,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: delay + 0.5
    });
  }, [delay]);
  
  return (
    <div 
      ref={leafRef}
      className={`absolute text-4xl opacity-20 ${className}`}
    >
      {emoji}
    </div>
  );
};