import { useEffect, useRef } from 'react';

/**
 * Soft ember radial glow that trails the cursor, plus a static scroll glow.
 * Runs on a single rAF loop and only writes transform/opacity, so it stays
 * on the compositor and does not fight the pinned sections.
 */
export default function CursorGlow({ reduced }) {
  const glowRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return undefined;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let visible = false;
    let raf = 0;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        glow.style.opacity = '1';
        dot.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      glow.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const loop = () => {
      // lerp: the halo drags behind the precise dot
      glowX += (targetX - glowX) * 0.085;
      glowY += (targetY - glowY) * 0.085;
      glow.style.transform = `translate3d(${glowX - 260}px, ${glowY - 260}px, 0)`;
      dot.style.transform = `translate3d(${targetX - 5}px, ${targetY - 5}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform md:block"
        style={{
          background:
            'radial-gradient(circle at center, rgb(var(--c-ember) / 0.22) 0%, rgb(var(--c-ember) / 0.10) 34%, rgb(var(--c-ember) / 0) 68%)',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[61] hidden h-[10px] w-[10px] rounded-full bg-ember/70 opacity-0 will-change-transform md:block"
      />
      {/* fixed ambient scroll glow, bottom of the viewport */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] h-[45vh]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 120%, rgb(var(--c-ember) / 0.16) 0%, rgb(var(--c-ember) / 0) 70%)',
        }}
      />
    </>
  );
}
