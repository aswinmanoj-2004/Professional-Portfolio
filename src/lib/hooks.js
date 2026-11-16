import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** True when the visitor asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduced;
}

/** Coarse pointer / small screen check, re-evaluated on resize. */
export function useIsCoarsePointer(breakpoint = 900) {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const apply = () => setCoarse(mq.matches || window.innerWidth < breakpoint);
    apply();
    window.addEventListener('resize', apply);
    mq.addEventListener?.('change', apply);
    return () => {
      window.removeEventListener('resize', apply);
      mq.removeEventListener?.('change', apply);
    };
  }, [breakpoint]);

  return coarse;
}

/** Live local clock string for a timezone, refreshed every minute. */
export function useLocalTime(timeZone = 'Asia/Kolkata') {
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone,
      }),
    [timeZone],
  );

  const [time, setTime] = useState(() => fmt.format(new Date()));

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [fmt]);

  return time;
}

/** Live clock plus a long-form date, e.g. `{ time: '11:46', date: '1 November, 2026' }`. */
export function useLocalClock(timeZone = 'Asia/Kolkata') {
  const time = useLocalTime(timeZone);

  const fmtDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone,
      }),
    [timeZone],
  );

  const [date, setDate] = useState(() => fmtDate.format(new Date()));

  useEffect(() => {
    const tick = () => setDate(fmtDate.format(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [fmtDate]);

  return { time, date };
}

const THEME_KEY = 'am-theme';
const META_LIGHT = '#f3efe8';
const META_DARK = '#1a1818';

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* storage blocked — fall through to the OS preference */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Light / dark theme, driven by the pull-cord in the corner.
 *
 * `toggle()` does not swap instantly: it flashes the bulb, re-lights the room
 * 260 ms later while the screen is washed out, then lifts the flash. CSS custom
 * properties cannot transition, so the flash is what hides the hard cut.
 */
export function useTheme({ reduced } = {}) {
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined' ? 'dark' : readStoredTheme(),
  );
  const [flashTo, setFlashTo] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? META_LIGHT : META_DARK);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (reduced) {
      setTheme(next);
      return;
    }
    setFlashTo(next);
    timers.current.push(
      window.setTimeout(() => setTheme(next), 260),
      window.setTimeout(() => setFlashTo(null), 860),
    );
  }, [reduced, theme]);

  return { theme, toggle, flashTo };
}
