import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from './InputField';
import { AuthButton } from './AuthButton';
import { Sprout, Eye, EyeOff, Mail } from 'lucide-react';
import { useStore } from '@/state/useStore';
import { Loader } from './Loader';
import { EmailConfirmationReminder } from './EmailConfirmationReminder';
import React from 'react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// Motivational quotes for the auth form
const motivationalQuotes = [
  {
    text: "Small consistent actions lead to remarkable results.",
    author: "Ancient Proverb"
  },
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Every habit you build plants a seed for your future self.",
    author: "HabitGarden"
  },
  {
    text: "You don't rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear"
  }
];

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const { signin, signup } = useStore();
  const navigate = useNavigate();

  // Rotate quotes every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (isSignUp) {
        const success = await signup(formData.email, formData.password);
        if (success) {
          // Show success message for signup and prompt user to sign in
          setShowSuccessMessage(true);
        } else {
          // Check if there's a specific error message from the store
          const storeError = useStore.getState().error;
          setErrors({ general: storeError || 'Signup failed. Please try again.' });
        }
      } else {
        const success = await signin(formData.email, formData.password);
        if (success) {
          // Load user data after successful signin
          await useStore.getState().loadHabits();
          navigate('/habits');
        } else {
          // Get error from store
          const storeError = useStore.getState().error;
          setErrors({ general: storeError || 'Signin failed. Please check your credentials.' });
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAuth = () => {
    // This will be called by the AuthButton
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field] || errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  // Show loader when submitting
  if (isSubmitting && !showSuccessMessage) {
    return (
      <Loader message={isSignUp ? 'Creating your account...' : 'Signing you in...'} />
    );
  }

  // Show success message after signup
  if (showSuccessMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative overflow-hidden border border-white/20"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full blur-xl"></div>
        
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sprout className="h-12 w-12 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Created!</h2>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully.
          </p>
          <p className="text-green-700 font-medium mb-4">
            {formData.email}
          </p>
          <p className="text-gray-600 mb-4">
            Please sign in with your credentials to continue.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowSuccessMessage(false);
              setIsSignUp(false);
            }}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Continue to Sign In
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative overflow-hidden border border-white/20"
    >
      {/* Decorative gradient elements on both sides */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full blur-2xl opacity-70"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full blur-2xl opacity-70"></div>
      <div className="absolute top-1/4 -left-10 w-32 h-32 bg-gradient-to-br from-lime-100 to-green-100 rounded-full blur-xl opacity-50"></div>
      <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full blur-xl opacity-50"></div>
      
      <div className="relative z-10">
        {/* Header with motivational quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Sprout className="h-10 w-10 text-green-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome to HabitGarden 🌿
          </h1>
          
          {/* Motivational quote */}
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-3"
          >
            <p className="text-sm text-gray-600 italic">
              "{motivationalQuotes[currentQuote].text}"
            </p>
            <p className="text-xs text-green-600 mt-1">
              — {motivationalQuotes[currentQuote].author}
            </p>
          </motion.div>
        </motion.div>



        {/* Error Message */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200"
          >
            {errors.general}
          </motion.div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-green-50 rounded-lg p-1 mb-6 border border-green-100">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsSignUp(false);
              setErrors({});
              setShowSuccessMessage(false);
            }}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              !isSignUp 
                ? 'bg-white text-green-700 shadow-sm border border-green-200' 
                : 'text-gray-600'
            }`}
          >
            Sign In
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsSignUp(true);
              setErrors({});
              setShowSuccessMessage(false);
            }}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              isSignUp 
                ? 'bg-white text-green-700 shadow-sm border border-green-200' 
                : 'text-gray-600'
            }`}
          >
            Sign Up
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AuthButton 
            onClick={handleAuth}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </motion.span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </AuthButton>
        </form>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => {
                  setIsSignUp(false);
                  setErrors({});
                  setShowSuccessMessage(false);
                }}
                className="font-medium text-green-600 hover:text-green-700"
              >
                Sign in
              </motion.button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => {
                  setIsSignUp(true);
                  setErrors({});
                  setShowSuccessMessage(false);
                }}
                className="font-medium text-green-600 hover:text-green-700"
              >
                Create one
              </motion.button>
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};