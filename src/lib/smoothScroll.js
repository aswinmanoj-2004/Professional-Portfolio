import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns the Lenis smooth-scroll instance for the whole app and keeps
 * ScrollTrigger in sync with it. Returns a ref to the Lenis instance so
 * components (door clicks, overlays) can stop/start scrolling.
 */
export function useSmoothScroll({ enabled = true } = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      ScrollTrigger.addEventListener('refresh', () => window.scrollTo(0, window.scrollY));
      ScrollTrigger.refresh();
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}

/** Scroll to a DOM id using Lenis when present; falls back to page top. */
export function scrollToId(lenis, id, offset = 0) {
  const el = document.getElementById(id);
  if (!el) {
    if (lenis?.current) lenis.current.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (lenis?.current) {
    lenis.current.scrollTo(el, { offset, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/** True when an element with this id exists in the document. */
export function hasSection(id) {
  return Boolean(document.getElementById(id));
}
