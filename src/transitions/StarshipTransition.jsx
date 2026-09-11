import { motion } from 'framer-motion';

export default function StarshipTransition({ children }) {
  return (
    <motion.div
      initial={{ y: '-50vh', x: '50vw', rotate: 45, opacity: 0, scale: 0.5 }}
      animate={{ 
        y: 0, x: 0, rotate: 0, opacity: 1, scale: 1,
        transition: { type: 'spring', stiffness: 200, damping: 20 }
      }}
      exit={{ y: '50vh', opacity: 0, transition: { duration: 0.2 } }}
      style={{ width: '100%', minHeight: '100vh', transformOrigin: 'center' }}
    >
      {children}
    </motion.div>
  );
}
