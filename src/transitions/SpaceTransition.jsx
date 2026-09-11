import { motion } from 'framer-motion';

export default function SpaceTransition({ children }) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
      exit={{ y: '-100%', opacity: 0, transition: { duration: 0.2 } }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
