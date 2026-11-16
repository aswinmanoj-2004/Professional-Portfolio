import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, statusBar, tickerWords } from '../data/portfolio';
import Magnetic from './Magnetic';
import { scrollToId } from '../lib/smoothScroll';

const EASE = [0.22, 1, 0.36, 1];

/** Word-by-word headline reveal. */
function RevealWords({ text, delay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: EASE, delay: delay + i * 0.045 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

/**
 * Portrait cutout that fades into the background at its base.
 *
 * Drag the cursor across it and a black-and-white spotlight follows: the print
 * stays in colour wherever the cursor has not been, so the photo develops under
 * the hand instead of flipping wholesale on hover.
 */
function Portrait({ reduced }) {
  const [src, setSrc] = useState(profile.photo);
  const frameRef = useRef(null);

  const fade = {
    maskImage: 'linear-gradient(180deg, #000 68%, rgba(0,0,0,0.35) 90%, transparent 99%)',
    WebkitMaskImage:
      'linear-gradient(180deg, #000 68%, rgba(0,0,0,0.35) 90%, transparent 99%)',
  };

  const moveSpot = (event) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.dataset.spot = 'on';
    el.style.setProperty('--spot-x', `${Math.round(event.clientX - rect.left)}px`);
    el.style.setProperty('--spot-y', `${Math.round(event.clientY - rect.top)}px`);
    el.style.setProperty('--spot-r', `${Math.round(Math.hypot(rect.width, rect.height) * 0.34)}px`);
  };

  const dropSpot = () => {
    const el = frameRef.current;
    if (!el) return;
    el.dataset.spot = 'off';
    el.style.setProperty('--spot-r', '0px');
  };

  return (
    <div
      ref={frameRef}
      className="portrait__frame mx-auto w-full max-w-[22rem] lg:max-w-[27rem]"
      onPointerMove={moveSpot}
      onPointerLeave={dropSpot}
      onPointerCancel={dropSpot}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-[8%] bottom-[18%] -z-10 blur-3xl"
        style={{
          background: 'radial-gradient(56% 46% at 50% 42%, rgba(228,102,90,0.24), rgba(228,102,90,0) 72%)',
        }}
      />
      <img
        src={src}
        onError={() => src !== profile.photoFallback && setSrc(profile.photoFallback)}
        alt={`${profile.name}, ${profile.role}`}
        width={408}
        height={612}
        decoding="async"
        className="h-auto w-full object-contain"
        style={fade}
      />
      {/* the greyscale copy the spotlight reveals; decorative, same source */}
      <img
        aria-hidden="true"
        src={src}
        alt=""
        width={408}
        height={612}
        decoding="async"
        className="portrait__bw h-auto w-full object-contain"
      />

      {reduced ? <span className="sr-only">Static portrait, no motion.</span> : null}
    </div>
  );
}

export default function Hero({ lenisRef, onContact, reduced }) {
  const toDoors = () => scrollToId(lenisRef, 'doors', -20);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col pt-[calc(var(--bar-h)+1rem)]"
    >
      <div className="shell grid flex-1 items-center gap-y-8 pb-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-x-12">
        {/* ---- left: the card ---- */}
        <div className="relative z-[2]">
          <motion.div
            className="mb-5 flex items-center gap-2.5"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <span className="chip chip--live !py-1.5 !px-3 text-[0.6875rem]">{profile.tag}</span>
          </motion.div>

          <h1 className="display text-[clamp(2.3rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            <RevealWords text={profile.heroNameLine} delay={0.2} />
            <br />
            <RevealWords text={profile.heroLead} delay={0.44} className="soft" />
            <span className="sr-only"> {profile.heroRest.replace(profile.heroNameLine, '').trim()}</span>
          </h1>

          <motion.div
            className="mt-5 max-w-full"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          >
            <RoleTicker words={tickerWords} reduced={reduced} />
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.86 }}
          >
            <Magnetic as="span" strength={0.22}>
              <button type="button" className="btn btn--solid" onClick={onContact}>
                Start a project <span className="btn__arrow">→</span>
              </button>
            </Magnetic>

            <Magnetic as="span" strength={0.18}>
              <button type="button" className="btn btn--ghost" onClick={toDoors}>
                See my work
              </button>
            </Magnetic>
          </motion.div>

          <motion.p
            className="mt-6 max-w-[48ch] text-sm leading-relaxed text-muted"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {profile.summary}
          </motion.p>
        </div>

        {/* ---- right: the person ---- */}
        <motion.div
          className="relative z-[1] lg:-mr-[6vw]"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.34 }}
        >
          <Portrait reduced={reduced} />
        </motion.div>
      </div>

      {/* ---- bottom status strip: last flex child of the hero column. Deliberately not
             `sticky bottom-0` — the hero is taller than short viewports, so a pinned strip
             floats up and paints over the summary paragraph. ---- */}
      <div className="relative z-[3] border-t border-line bg-panel/40">
        <div className="shell flex h-12 items-center justify-between gap-4">
          <p className="chip--live flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-label text-rose">
            <i aria-hidden="true" />
            {statusBar.left}
          </p>
          <p className="hidden font-mono text-[0.625rem] uppercase tracking-label text-faint sm:block">
            {statusBar.centre}
          </p>
          <button
            type="button"
            onClick={toDoors}
            className="group flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-label text-faint transition-colors hover:text-fg"
          >
            {statusBar.right}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-0.5">
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function RoleTicker({ words, reduced }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced || words.length < 2) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => window.clearInterval(id);
  }, [reduced, words.length]);

  return (
    <div className="inline-flex items-baseline gap-3">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="display text-[clamp(1.6rem,4vw,2.6rem)] font-semibold text-ember"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}.
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
