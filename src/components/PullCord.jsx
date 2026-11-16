import { useEffect, useRef, useState } from 'react';

const PULL_MAX = 96; // px the cord can stretch
const PULL_TRIGGER = 40; // px that counts as a deliberate pull

/**
 * The pull-cord in the top-right corner: decoration and light switch.
 *
 * Drag it down (or tap it, or focus it and press Enter) and it asks the app to
 * change theme. The cord itself stretches through the `--pull` custom property
 * and springs back on release; the sway animation pauses while you hold it so
 * the two transforms do not fight.
 *
 * It fades away once the hero leaves the viewport — and stops receiving clicks
 * and tab stops while faded — and the header carries a compact copy of the same
 * control so the theme stays reachable everywhere. On phones the cord would
 * tangle with the Menu button, so it is hidden below the `sm` breakpoint.
 *
 * The faded cord is switched off with inline `pointer-events` because the
 * unlayered `.pullcord__lever` rule insists on `auto`.
 */
export default function PullCord({ theme, onToggle }) {
  const [inHero, setInHero] = useState(true);
  const [pull, setPull] = useState(0);
  const startY = useRef(null);
  const pulled = useRef(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInHero(entry.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 0.6, 1] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const onPointerDown = (event) => {
    startY.current = event.clientY;
    pulled.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (startY.current === null) return;
    const delta = Math.max(0, Math.min(PULL_MAX, event.clientY - startY.current));
    if (delta >= PULL_TRIGGER) pulled.current = true;
    setPull(delta);
  };

  const onPointerUp = () => {
    if (startY.current === null) return;
    startY.current = null;
    setPull(0);
    if (pulled.current) onToggle();
  };

  // A tap never travels far enough to set `pulled`, so it falls through here.
  const onClick = () => {
    if (pulled.current) {
      pulled.current = false;
      return;
    }
    onToggle();
  };

  return (
    <div
      className={`pullcord transition-opacity duration-700 hidden sm:flex ${
        inHero ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${pull > 0 ? 'is-pulling' : ''}`}
      style={{
        '--pull': `${pull}px`,
        animationPlayState: pull ? 'paused' : 'running',
        transitionDuration: startY.current === null ? undefined : '0s',
      }}
    >
      <button
        type="button"
        className="pullcord__lever flex flex-col items-center"
        tabIndex={inHero ? 0 : -1}
        style={{ pointerEvents: inHero ? 'auto' : 'none' }}
        aria-label={
          theme === 'dark'
            ? 'Pull the cord to turn the lights on'
            : 'Pull the cord to turn the lights off'
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <span className="pullcord__string" />
        <span className="pullcord__toggle" />
      </button>
    </div>
  );
}
