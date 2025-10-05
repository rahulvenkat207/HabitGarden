import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export interface CarouselSlide {
  id: string;
  title: string;
  text: string;
  image?: string;
  icon?: string;
  variant?: 'plant' | 'quote' | 'stats' | 'achievement';
}

interface HabitCarouselProps {
  slides: CarouselSlide[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const HabitCarousel = ({ slides, className = '', autoPlay = false, interval = 5000 }: HabitCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallaxRef.current) return;

    // Set up GSAP parallax effect
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    parallaxTl.fromTo(
      parallaxRef.current,
      { yPercent: -10 },
      { yPercent: 10, ease: 'none' }
    );

    return () => {
      parallaxTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={carouselRef} className={`relative w-full ${className}`}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          <AnimatePresence>
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="h-full"
                >
                  <div ref={parallaxRef} className="h-full">
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 h-full flex flex-col">
                        {slide.image ? (
                          <div className="mb-4 rounded-xl overflow-hidden">
                            <img 
                              src={slide.image} 
                              alt={slide.title} 
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        ) : slide.icon ? (
                          <div className="mb-4 text-4xl text-center">{slide.icon}</div>
                        ) : null}
                        
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{slide.title}</h3>
                        <p className="text-gray-600 flex-grow">{slide.text}</p>
                        
                        {slide.variant === 'plant' && (
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div 
                                className="bg-green-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Growing strong!</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </AnimatePresence>
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/80 hover:bg-white border-0 shadow-lg rounded-full w-10 h-10" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/80 hover:bg-white border-0 shadow-lg rounded-full w-10 h-10" />
      </Carousel>
    </div>
  );
};

export default HabitCarousel;