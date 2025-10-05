import { AuthContainer } from '@/components/auth/AuthContainer';
import { AuthForm } from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

const Signin = () => {
  return (
    <AuthContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AuthForm />
      </motion.div>
    </AuthContainer>
  );
};

export default Signin;