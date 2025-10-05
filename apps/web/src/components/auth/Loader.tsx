import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

export const Loader = ({ message = 'Processing...' }: LoaderProps) => {
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
          <Leaf className="h-12 w-12 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Wait</h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    </motion.div>
  );
};