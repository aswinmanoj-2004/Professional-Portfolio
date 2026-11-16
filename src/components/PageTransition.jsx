import { motion } from 'framer-motion';

/**
 * Light per-route fade that layers under the curtain wipe.
 * Opacity only on purpose: animating `y` or declaring `will-change: transform`
 * turns this wrapper into the containing block for `position: fixed` descendants,
 * which breaks ScrollTrigger's pinning on #doors and #story.
 */
export default function PageTransition({ children, reduced, delay = 0.18 }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className="will-change-[opacity]"
    >
      {children}
    </motion.div>
  );
}
