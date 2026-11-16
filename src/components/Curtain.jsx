import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { onNavigateRequest } from '../lib/nav';

const COVER_MS = 460;
const HOLD_MS = 90;
const UNCOVER_MS = 520;

/**
 * Route transition curtain. Links announce themselves through the nav bus;
 * this component wipes a warm charcoal panel across the screen, swaps the
 * route while covered, then lifts the panel away.
 */
export default function Curtain({ reduced }) {
  const [covered, setCovered] = useState(false);
  const [label, setLabel] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const timers = useRef([]);
  const lastPath = useRef(location.pathname);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(
    () =>
      onNavigateRequest((to) => {
        if (!to) return;
        const [pathPart, hashPart] = to.split('#');
        const path = pathPart || '/';
        const hash = hashPart ? `#${hashPart}` : '';
        const fullPath = path + hash;
        const currentFull = window.location.pathname + window.location.hash;
        if (fullPath === currentFull) return;
        if (reduced) {
          navigate(path + hash);
          if (hash) {
            window.setTimeout(() => {
              const el = document.getElementById(hashPart);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }
          return;
        }
        setLabel((path === '/' ? 'Home' : path.replace(/^\//, '').replace(/-/g, ' ')) + (hash ? ` · ${hashPart}` : ''));
        setCovered(true);
        timers.current.push(
          window.setTimeout(() => {
            navigate(path + hash);
            if (hash) {
              window.setTimeout(() => {
                const el = document.getElementById(hashPart);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo(0, 0);
              }, 120);
            } else {
              window.scrollTo(0, 0);
            }
          }, COVER_MS),
          window.setTimeout(() => setCovered(false), COVER_MS + HOLD_MS),
        );
      }),
    [navigate, reduced],
  );

  // Back / forward buttons, and the desktop nav bar's plain <Link>s, get a lighter
  // wipe. Those links do not go through the bus below, so the scroll reset lives here.
  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;
    window.scrollTo(0, 0);
    if (covered) return; // already mid-transition
    if (reduced) return;
    setCovered(true);
    timers.current.push(window.setTimeout(() => setCovered(false), COVER_MS + HOLD_MS));
  }, [location.pathname, covered, reduced]);

  return (
    <AnimatePresence>
      {covered && (
        <motion.div
          key="curtain"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[115] overflow-hidden"
          initial={false}
          animate={{ y: 0 }}
          exit={{ y: '-101%' }}
          transition={{ duration: UNCOVER_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 bg-panel2"
            initial={{ y: '101%' }}
            animate={{ y: 0 }}
            transition={{ duration: COVER_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-ember/90 mix-blend-overlay"
            initial={{ y: '104%' }}
            animate={{ y: 0 }}
            transition={{ duration: COVER_MS / 1000, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          />
          <motion.div
            className="absolute inset-0 bg-panel"
            initial={{ y: '102%' }}
            animate={{ y: 0 }}
            transition={{ duration: COVER_MS / 1000, ease: [0.22, 1, 0.36, 1], delay: 0.09 }}
          />
          <div className="absolute inset-0 flex items-end justify-between gap-6 p-[var(--gut)] pb-10">
            <span className="label label--plain max-sm:hidden">{label}</span>
            <span className="label label--plain">Aswin Manoj</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
