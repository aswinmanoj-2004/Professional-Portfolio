import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/portfolio';

const SESSION_KEY = 'am.preloader.entered';

/**
 * Minimal gate: the name sitting on a hairline that fills 0–100, then a plain
 * "Enter". Shown once per browser session so route changes never re-trigger it.
 */
export default function Preloader({ onEnter, reduced }) {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const timer = useRef(0);
  const enterRef = useRef(null);

  useEffect(() => {
    let skip = false;
    try {
      skip = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      skip = false;
    }

    if (skip || reduced) {
      setGone(true);
      onEnter?.();
      return undefined;
    }

    const duration = 1500;
    const start = performance.now();

    // Timed off the clock rather than requestAnimationFrame: rAF is paused while
    // the tab sits in the background, which would strand a visitor on "0%".
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / duration);
      // ease-out so the count lands softly on 100
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t >= 1) {
        window.clearInterval(timer.current);
        setReady(true);
      }
    };

    timer.current = window.setInterval(tick, 40);
    tick();
    return () => window.clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Hand the keyboard over to the only thing worth pressing.
  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  const enter = () => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode — ignore */
    }
    setGone(true);
    onEnter?.();
  };

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[130] grid place-items-center bg-bg px-[var(--gut)]"
          style={{ cursor: ready ? 'pointer' : 'default' }}
          onClick={enter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="w-full max-w-[min(26rem,86vw)]">
            <p className="display text-[clamp(1.6rem,4.5vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-fg">
              {profile.name}
            </p>

            {/* hairline that fills as the counter climbs */}
            <div className="mt-6 h-px w-full bg-line">
              <div
                className="h-px bg-fg transition-transform duration-150 ease-out"
                style={{ transform: `scaleX(${pct / 100})`, transformOrigin: 'left' }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-label">
              <span className="text-faint">{ready ? 'Ready' : 'Loading'}</span>

              <AnimatePresence mode="wait" initial={false}>
                {ready ? (
                  <motion.button
                    key="enter"
                    ref={enterRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      enter();
                    }}
                    className="rounded-pill text-fg underline decoration-fg/30 decoration-1 underline-offset-[0.35em] transition-colors duration-300 hover:decoration-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    Enter <span aria-hidden="true">→</span>
                  </motion.button>
                ) : (
                  <motion.span
                    key="pct"
                    className="tabular-nums text-fg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pct}%
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
