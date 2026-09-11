import { motion, useScroll, useTransform } from 'framer-motion';
import { themeConfig } from '../../config/theme';
import './PurpleMistBackground.css';

/**
 * PurpleMistBackground Component
 * 
 * Renders a dynamic, translucent purple mist that drifts organically in the background
 * and responds to page scrolling via hardware-accelerated parallax layers.
 * 
 * @param {Object} props
 * @param {number} [props.density]   - Mist density multiplier (0.1 = faint/subtle, 1.0 = heavy/thick).
 *                                     Defaults to themeConfig.smoke.density.
 * @param {string} [props.className] - Optional CSS class for further styling or transitions.
 */
export default function PurpleMistBackground({ density = themeConfig.smoke.density, className = '' }) {
  // Clamp density to safe visual range [0.1, 1.0]
  const safeDensity = Math.max(0.1, Math.min(1.0, density));

  // Framer Motion hook to listen to window scroll position.
  // Updates CSS transforms directly on the GPU without triggering React component re-renders.
  const { scrollY } = useScroll();

  // Multi-layered parallax translation:
  // Each mist layer travels at a distinct rate relative to the scroll distance (0 to 3500px)
  const yLayer1 = useTransform(scrollY, [0, 3500], [0, -320]); // Deep layer (slow)
  const yLayer2 = useTransform(scrollY, [0, 3500], [0, -680]); // Mid layer (medium)
  const yLayer3 = useTransform(scrollY, [0, 3500], [0, -1050]); // Foreground layer (fast)
  const yLayer4 = useTransform(scrollY, [0, 3500], [0, 260]);  // Counter-drift layer (drifts downward)

  // Dynamic CSS custom properties passed to stylesheet based on the density variable
  const dynamicStyle = {
    '--mist-opacity': (safeDensity * 0.8).toFixed(2),
    '--mist-blur': `${Math.round(45 + safeDensity * 30)}px`,
  };

  return (
    <div
      className={`purple-mist-viewport ${className}`}
      style={dynamicStyle}
      aria-hidden="true"
    >
      {/* Parallax Layer 1: Deep Violet Nebula (Slow drift) */}
      <motion.div className="mist-layer" style={{ y: yLayer1 }}>
        <div className="mist-cloud cloud-1" />
      </motion.div>

      {/* Parallax Layer 2: Neon Purple / Orchid (Medium drift) */}
      <motion.div className="mist-layer" style={{ y: yLayer2 }}>
        <div className="mist-cloud cloud-2" />
      </motion.div>

      {/* Parallax Layer 3: Electric Indigo / Cosmic Dust (Fast drift) */}
      <motion.div className="mist-layer" style={{ y: yLayer3 }}>
        <div className="mist-cloud cloud-3" />
      </motion.div>

      {/* Parallax Layer 4: Soft Lavender Wisps (Subtle atmospheric counter-shift) */}
      <motion.div className="mist-layer" style={{ y: yLayer4 }}>
        <div className="mist-cloud cloud-4" />
      </motion.div>
    </div>
  );
}

