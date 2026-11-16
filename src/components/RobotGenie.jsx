import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../lib/hooks';

export default function RobotGenie({ theme, onToggle }) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState('idle'); // idle | falling | returning

  const handleClick = () => {
    if (state !== 'idle' || reduced) {
      if (reduced) onToggle();
      return;
    }
    setState('falling');
    onToggle();
    window.setTimeout(() => setState('returning'), 700);
    window.setTimeout(() => setState('idle'), 1500);
  };

  const eyeGlow = theme === 'dark' ? '#22d3ee' : theme === 'light' ? '#0ea5e9' : theme === 'red' ? '#f87171' : '#60a5fa';

  return (
    <div className="fixed right-6 top-[calc(var(--bar-h)+0.25rem)] z-[90] flex flex-col items-center" style={{ perspective: 600 }}>
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={
          state === 'idle'
            ? { y: [0, -5, 0], rotateZ: [0, 3, -3, 0], scaleY: [1, 1.02, 1] }
            : state === 'falling'
            ? { y: [0, -15, 40, 110, 95], rotateZ: [0, 15, -20, 5, 0], scaleY: [1, 0.9, 1.1, 0.85, 1] }
            : { y: [95, -8, 0], rotateZ: [0, -8, 2, 0], scaleY: [0.85, 1.05, 1] }
        }
        transition={
          state === 'idle'
            ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
            : state === 'falling'
            ? { duration: 0.7, ease: [0.4, 0, 0.2, 1], times: [0, 0.15, 0.4, 0.75, 1] }
            : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {/* head */}
        <div className="relative mx-auto h-9 w-11 rounded-2xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-500 shadow-[0_6px_12px_rgba(0,0,0,0.4),inset_0_2px_3px_rgba(255,255,255,0.4)]">
          {/* eyes */}
          <div className="absolute top-3 left-1/2 flex -translate-x-1/2 gap-2">
            <motion.span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: eyeGlow, boxShadow: `0 0 8px ${eyeGlow}` }}
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, times: [0, 0.05, 0.1] }}
            />
            <motion.span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: eyeGlow, boxShadow: `0 0 8px ${eyeGlow}` }}
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, times: [0, 0.05, 0.1] }}
            />
          </div>
          {/* mouth */}
          <div className="absolute bottom-2 left-1/2 h-1 w-3.5 -translate-x-1/2 rounded-full bg-slate-700" />
          {/* cheek glow */}
          <div className="absolute bottom-3 left-1 h-1.5 w-1.5 rounded-full bg-pink-300/60" />
          <div className="absolute bottom-3 right-1 h-1.5 w-1.5 rounded-full bg-pink-300/60" />
        </div>
        {/* body */}
        <div className="mx-auto mt-1 h-6 w-9 rounded-xl bg-gradient-to-b from-slate-300 to-slate-600 shadow-[0_4px_8px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)]">
          {/* chest light */}
          <div className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: eyeGlow, boxShadow: `0 0 6px ${eyeGlow}` }} />
        </div>
        {/* base / genie lamp */}
        <div className="mx-auto mt-1 h-2.5 w-10 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow-[0_3px_6px_rgba(0,0,0,0.4)]" />
        {/* arms */}
        <div className="absolute top-9 -left-1.5 h-4 w-1.5 rounded-full bg-slate-400" />
        <div className="absolute top-9 -right-1.5 h-4 w-1.5 rounded-full bg-slate-400" />
      </motion.div>

      <button
        type="button"
        onClick={handleClick}
        disabled={state !== 'idle'}
        className="mt-1 rounded-full bg-ember/20 px-2 py-0.5 text-[0.6rem] font-medium text-ember transition-colors hover:bg-ember/40 disabled:opacity-50"
        aria-label="Toggle theme"
      >
        theme
      </button>
    </div>
  );
}
