import { motion } from 'framer-motion';

export default function MarioTransition({ children }) {
  return (
    <motion.div
      initial={{ x: '-100%', y: 0, opacity: 0 }}
      animate={{ 
        x: 0, 
        y: [0, -30, 0], 
        opacity: 1, 
        transition: { 
          x: { type: 'spring', stiffness: 300, damping: 25 },
          y: { type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }
        } 
      }}
      exit={{ x: '100%', opacity: 0, transition: { duration: 0.2 } }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
