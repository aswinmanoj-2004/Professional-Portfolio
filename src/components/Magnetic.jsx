import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Magnetic wrapper: the child drifts toward the cursor while hovered.
 * Only transform is animated, so it stays on the compositor.
 */
export default function Magnetic({ children, strength = 0.28, className = '', as = 'span' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 18, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);
  const rotate = useTransform(sx, [-40, 40], [-2.5, 2.5]);

  const MotionTag = motion[as] || motion.span;

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionTag
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      style={{ x: sx, y: sy, rotate }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </MotionTag>
  );
}
