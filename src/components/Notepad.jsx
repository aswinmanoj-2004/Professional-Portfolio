import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PAGE_HOLD_MS = 2600;
const FLIP_MS = 0.7;
const FLIP_EASE = [0.4, 0.02, 0.6, 1];
const RINGS = 12;

export default function Notepad({ words, reduced, className = '' }) {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const next = (index + 1) % words.length;

  useEffect(() => {
    if (reduced || flipping || words.length < 2) return undefined;
    const id = window.setTimeout(() => setFlipping(true), PAGE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [reduced, flipping, words.length, index]);

  useEffect(() => {
    if (!reduced || words.length < 2) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), PAGE_HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduced, words.length]);

  const finishFlip = () => {
    setFlipping(false);
    setIndex(next);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className={`notepad isolate w-fit max-w-full rotate-[-1.4deg] px-6 pb-5 pt-9 sm:px-8 ${className}`}
      >
        <div className="notepad__rings">
          {Array.from({ length: RINGS }, (_, i) => (
            <span key={i} className="notepad__ring" />
          ))}
        </div>

        <div className="notepad__pages text-[clamp(2rem,5.6vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.03em]">
          {words.map((word, i) => {
            // only render current and next pages
            if (i !== index && i !== next) return null;
            const isTop = i === index;
            return (
              <motion.div
                key={`${word}-${i}`}
                className={isTop ? 'notepad__sheet' : 'notepad__underlay'}
                style={{ zIndex: isTop ? 2 : 1 }}
                initial={false}
                animate={isTop && flipping ? { rotateX: -178 } : { rotateX: 0 }}
                transition={{ duration: reduced ? 0.01 : FLIP_MS, ease: FLIP_EASE }}
                onAnimationComplete={isTop && flipping ? finishFlip : undefined}
              >
                <p className="display notepad__word">{word}</p>
                <p className="notepad__pagenum">
                  {String(i + 1).padStart(2, '0')} / {String(words.length).padStart(2, '0')}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="sr-only">I work as: {words.join(', ')}.</p>
    </>
  );
}
