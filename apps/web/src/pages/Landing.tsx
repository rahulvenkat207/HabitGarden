import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Leaf, Sprout, TreePine, Award, Calendar, TrendingUp } from 'lucide-react';
import HabitCarousel from '@/components/HabitCarousel';
import { CarouselSlide } from '@/components/HabitCarousel';

const Landing = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: 'Build Habits Naturally',
      description: 'Cultivate positive routines with our gentle, plant-based approach to habit formation.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: 'Track Your Progress',
      description: 'Visualize your growth with beautiful charts and garden representations.',
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: 'Earn Achievements',
      description: 'Unlock badges and rewards as you maintain consistency.',
    },
  ];

  const carouselSlides: CarouselSlide[] = [
    {
      id: '1',
      title: 'Start Small, Grow Strong',
      text: 'Like a seed becoming a mighty tree, your habits grow with consistent care.',
      icon: '🌱',
      variant: 'plant'
    },
    {
      id: '2',
      title: 'Consistency is Key',
      text: 'Every day you check in, your habit plant grows stronger and healthier.',
      icon: '🌿',
      variant: 'plant'
    },
    {
      id: '3',
      title: 'Celebrate Milestones',
      text: 'Reach new heights with every streak milestone you achieve.',
      icon: '🏆',
      variant: 'achievement'
    },
    {
      id: '4',
      title: 'Find Your Rhythm',
      text: 'Discover the perfect balance of habits that work for your lifestyle.',
      icon: '🎶',
      variant: 'quote'
    },
    {
      id: '5',
      title: 'Visualize Growth',
      text: 'See your progress come to life in your personal habit garden.',
      icon: '🌳',
      variant: 'plant'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="inline-block mb-6"
          >
            <div className="bg-green-100 p-4 rounded-full inline-block">
              <Sprout className="h-12 w-12 text-green-600" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Grow Your <span className="text-green-600">Habit Garden</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Cultivate positive habits and watch your personal garden flourish with every consistent action.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full">
              <Link to="/signin">Get Started</Link>
            </Button>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <HabitCarousel slides={carouselSlides} className="py-8" />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Habits?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have cultivated lasting positive changes in their lives with HabitGarden.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full">
            <Link to="/signin">Begin Your Journey</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;