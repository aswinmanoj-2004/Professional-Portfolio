import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollToId } from '../lib/smoothScroll';

/** Floating "Back to top ↑" button, appears after the first viewport. */
export default function BackToTop({ lenisRef }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Back to top"
          onClick={() => {
            if (lenisRef?.current) lenisRef.current.scrollTo(0, { duration: 1.4 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            scrollToId(lenisRef, 'hero', -10);
          }}
          className="btn btn--ghost fixed bottom-5 right-5 z-[95] !px-4 !py-2.5 text-[0.8125rem] backdrop-blur-md"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Back to top <span aria-hidden="true">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
