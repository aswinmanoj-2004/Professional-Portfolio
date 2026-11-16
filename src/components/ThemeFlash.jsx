import { AnimatePresence, motion } from 'framer-motion';

/* The overlay peaks at ~34% of its life, which is exactly when `useTheme`
   swaps the token set underneath it. */
const FLASH = { duration: 0.78, times: [0, 0.34, 1], ease: 'easeOut' };

/**
 * The bulb flash that covers a theme change.
 *
 * CSS custom properties cannot transition, so `data-theme` repaints the whole
 * site in one frame. This wash of light — pouring from the top-right corner,
 * where the pull-cord hangs — hides that hard cut and reads as the lights
 * coming on or going off.
 */
export default function ThemeFlash({ to }) {
  return (
    <AnimatePresence>
      {to ? (
        <motion.div
          key={to}
          aria-hidden="true"
          data-to={to}
          className="theme-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={FLASH}
        />
      ) : null}
    </AnimatePresence>
  );
}
