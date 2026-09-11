import { motion } from 'framer-motion';

export default function AIMagicTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.9, transition: { duration: 0.2 } }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
