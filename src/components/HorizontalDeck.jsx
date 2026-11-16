import { useEffect, useRef, useState, useCallback } from 'react';

export default function HorizontalDeck({ children, onIndexChange }) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const slides = useRef([]);
  const count = Array.isArray(children) ? children.length : 1;
  const childArray = Array.isArray(children) ? children : [children];

  const scrollTo = useCallback((i) => {
    const c = containerRef.current;
    if (!c) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    c.scrollTo({ left: clamped * c.clientWidth, behavior: 'smooth' });
    setIndex(clamped);
    onIndexChange?.(clamped);
  }, [count, onIndexChange]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return undefined;

    const onWheel = (e) => {
      // translate vertical wheel into horizontal movement
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        c.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    };
    c.addEventListener('wheel', onWheel, { passive: false });

    const onScroll = () => {
      const i = Math.round(c.scrollLeft / c.clientWidth);
      if (i !== index) {
        setIndex(i);
        onIndexChange?.(i);
      }
    };
    c.addEventListener('scroll', onScroll, { passive: true });

    // touch swipe
    let startX = 0;
    let startScroll = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startScroll = c.scrollLeft;
    };
    const onTouchMove = (e) => {
      const dx = startX - e.touches[0].clientX;
      c.scrollLeft = startScroll + dx;
    };
    c.addEventListener('touchstart', onTouchStart, { passive: true });
    c.addEventListener('touchmove', onTouchMove, { passive: true });

    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') scrollTo(index + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') scrollTo(index - 1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      c.removeEventListener('wheel', onWheel);
      c.removeEventListener('scroll', onScroll);
      c.removeEventListener('touchstart', onTouchStart);
      c.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [index, scrollTo, onIndexChange]);

  // keep index in sync on resize
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return undefined;
    const onResize = () => c.scrollTo({ left: index * c.clientWidth, behavior: 'auto' });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [index]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        ref={containerRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {childArray.map((child, i) => (
          <section
            key={i}
            className="relative h-full w-screen flex-none snap-start overflow-y-auto"
          >
            {child}
          </section>
        ))}
      </div>

      {/* side arrow navigation */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => scrollTo(index - 1)}
        disabled={index === 0}
        className="fixed left-6 top-1/2 z-[90] hidden -translate-y-1/2 text-3xl text-fg/40 transition-all duration-300 hover:scale-110 hover:text-ember disabled:opacity-0 md:block"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => scrollTo(index + 1)}
        disabled={index === count - 1}
        className="fixed right-6 top-1/2 z-[90] hidden -translate-y-1/2 text-3xl text-fg/40 transition-all duration-300 hover:scale-110 hover:text-ember disabled:opacity-0 md:block"
      >
        →
      </button>

      {/* slide counter (minimal) */}
      <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
        {index + 1} / {count}
      </div>
    </div>
  );
}
