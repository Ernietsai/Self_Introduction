import { motion } from 'framer-motion';

export default function DefaultTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
