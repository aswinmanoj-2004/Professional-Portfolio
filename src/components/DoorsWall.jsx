import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { doors, doorsIntro } from '../data/portfolio';
import { requestNavigate } from '../lib/nav';

gsap.registerPlugin(ScrollTrigger, Draggable);

const AJAR = 14; /** degrees the door stands open at rest, so the dark room shows in the gap */
const HINGE = 58; /** degrees it swings to on hover — the room opens up, the leaf stays readable */
const DIVE_MS = 560; /** how long the camera takes to push through the doorway */

/** Brass nameplate, lever handle and keyhole escutcheon, stamped on the leaf. */
function Hardware({ plate }) {
  return (
    <>
      <div className="brass absolute inset-x-[13%] top-[30%] z-[2] rounded-[3px] px-2 py-2 text-center">
        <span className="absolute left-1.5 top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-[#5b4113]/70" />
        <span className="absolute right-1.5 top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-[#5b4113]/70" />
        {plate.map((line) => (
          <span
            key={line}
            className="brass-etch block font-mono text-[0.56rem] font-bold uppercase leading-[1.35] tracking-[0.14em] sm:text-[0.625rem]"
          >
            {line}
          </span>
        ))}
      </div>

      {/* lever handle, pointing in from the lock edge */}
      <span className="absolute right-[6%] top-[54%] z-[2] flex items-center">
        <span className="brass h-[7px] w-[30%] min-w-[26px] rounded-l-full rounded-r-[2px]" />
        <span className="brass h-4 w-4 rounded-full" />
      </span>

      {/* keyhole plate below the handle */}
      <span className="brass absolute right-[9%] top-[63%] z-[2] flex h-9 w-[15px] flex-col items-center justify-center rounded-full">
        <span className="h-[6px] w-[6px] rounded-full bg-[#2b1d07]" />
        <span className="-mt-[1px] h-[11px] w-[3px] rounded-b-[2px] bg-[#2b1d07]" />
      </span>
    </>
  );
}

/**
 * One door in the wall. It stands ajar so the room behind it reads as dark
 * depth; hovering swings it wider, clicking (or Enter) walks you into it.
 */
function DoorCard({ door, onEnter, onHover, reduced }) {
  const [open, setOpen] = useState(false);
  const [diving, setDiving] = useState(false);
  const unitRef = useRef(null);

  const set = (value) => {
    setOpen(value);
    onHover(value ? `Click to enter · ${door.title}` : null);
  };

  /* Walk in: the leaf swings wide and the camera pushes through this doorway —
     the whole wall rushes past the screen until the room goes black. */
  const go = () => {
    if (reduced) return onEnter(door.path);
    setDiving(true);
    onEnter(door.path, unitRef.current?.getBoundingClientRect());
  };

  const angle = diving ? 104 : reduced ? AJAR : open ? HINGE : AJAR;

  return (
    <article
      ref={unitRef}
      className="door-unit group relative h-[clamp(19rem,62vh,30rem)] w-[clamp(13rem,24vw,16.5rem)] flex-none sm:snap-center"
      style={{ perspective: '1100px' }}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
    >
      {/* the doorframe set into the wall */}
      <div className="door-frame absolute inset-0" />

      {/* the room behind the door — nothing in it but depth */}
      <div className="door-interior absolute inset-[9px] overflow-hidden">
        <span className="door-room" aria-hidden="true" />
        {/* the light the room throws on its own floor, brighter as the door swings */}
        <span className="door-threshold" aria-hidden="true" style={{ opacity: open ? 1 : 0.55 }} />
        {/* the shadow the leaf lays across the room */}
        <span
          className="door-cast"
          aria-hidden="true"
          style={{ opacity: open ? 1 : 0.62 }}
        />
      </div>

      {/* the hinged leaf */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Enter the ${door.title} room`}
        onFocus={() => set(true)}
        onBlur={() => set(false)}
        onClick={go}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            go();
          }
        }}
        className="door-leaf absolute inset-[5px] origin-left cursor-pointer transition-[transform,box-shadow] duration-[700ms] ease-[cubic-bezier(.16,1,.3,1)] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/70"
        style={{
          '--door-paint': door.paint,
          '--door-shade': door.shade,
          transform: `rotateY(-${angle}deg)`,
        }}
      >
        <Hardware plate={door.plate} />
      </div>

      {/* the invitation, shown on the doorway while the door stands open */}
      <span aria-hidden="true" className={`door-enter ${open && !diving ? 'is-visible' : ''}`}>
        Click to enter
      </span>
    </article>
  );
}

/** Cursor-following "enter" pill shown while hovering a door (fine pointers). */
function EnterCursor({ active, label }) {
  const ref = useRef(null);
  const xSet = useRef(null);
  const ySet = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    xSet.current = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' });
    ySet.current = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3' });
    const move = (event) => {
      xSet.current?.(event.clientX - 46);
      ySet.current?.(event.clientY - 20);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden whitespace-nowrap rounded-pill border border-ember/40 bg-bg/90 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-label text-ember backdrop-blur-sm lg:block"
    >
      {label}
    </div>
  );
}

export default function DoorsWall({ reduced, coarse }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const diveRef = useRef(null);
  const railRef = useRef(null);
  const diveTimer = useRef(null);
  const [hoverDoor, setHoverDoor] = useState(null);
  const [diving, setDiving] = useState(false);

  useEffect(() => () => window.clearTimeout(diveTimer.current), []);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return undefined;
    if (reduced || coarse) return undefined;

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
    });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${getDistance() + window.innerHeight * 0.6}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      animation: tween,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (railRef.current) {
          railRef.current.style.transform = `scaleX(${0.18 + self.progress * 0.82})`;
        }
      },
    });

    // Drag the wall sideways, synced to vertical page scroll.
    const draggable = Draggable.create(track, {
      type: 'x',
      bounds: { minX: -getDistance(), maxX: 0, minY: 0, maxY: 0 },
      inertia: false,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onDrag: function () {
        const progress = gsap.utils.clamp(0, 1, -this.x / getDistance());
        trigger.scrollAnimation?.progress(progress);
      },
    })[0];

    const refresh = () => {
      draggable?.bounds &&
        draggable.applyBounds({ minX: -getDistance(), maxX: 0, minY: 0, maxY: 0 });
    };
    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('resize', refresh);
      draggable?.kill();
      tween.kill();
      trigger.kill();
    };
  }, [reduced, coarse]);

  /* Clicking a door walks you into its room: the wall is scaled up around that
     doorway — the camera push of the reference — the room goes black around you,
     and the route changes once you are through. */
  const enter = (path, rect) => {
    if (reduced) return requestNavigate(path);
    const box = diveRef.current?.getBoundingClientRect();
    if (box && rect) {
      /* zoom centred on the doorway you picked, not on the middle of the wall */
      diveRef.current.style.setProperty('--dive-x', `${rect.left + rect.width / 2 - box.left}px`);
      diveRef.current.style.setProperty('--dive-y', `${rect.top + rect.height / 2 - box.top}px`);
    }
    setDiving(true);
    window.clearTimeout(diveTimer.current);
    diveTimer.current = window.setTimeout(() => requestNavigate(path), DIVE_MS);
  };

  return (
    <section
      id="doors"
      ref={sectionRef}
      className={`doors-viewport relative isolate flex flex-col overflow-hidden ${
        diving ? 'is-diving' : ''
      }`}
    >
      <EnterCursor active={Boolean(hoverDoor) && !reduced && !coarse} label={hoverDoor || 'Enter'} />

      {/* the room going dark as you step through the doorway */}
      <span aria-hidden="true" className={`door-veil ${diving ? 'is-on' : ''}`} />

      <div className="shell shrink-0 pt-[calc(var(--bar-h)+1rem)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="label">{doorsIntro.eyebrow}</p>
            <h2 className="display mt-2 text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              {doorsIntro.title}
            </h2>
          </div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-label text-faint">
            {doorsIntro.sub} <span aria-hidden="true">→</span>
          </p>
        </div>
      </div>

      {/* skirting the wall of doors stands against */}
      <div className="wall-base" aria-hidden="true" />

      <div ref={diveRef} className={`doors-dive ${diving ? 'is-diving' : ''}`}>
        <div
          ref={trackRef}
          className="doors-track relative z-[1] pt-6 pb-[2.25rem]"
          onMouseLeave={() => setHoverDoor(null)}
        >
          {/* leading spacer so the first door doesn't sit under the heading */}
          <div className="hidden h-full w-[max(0px,calc((100vw-88rem)/2))] flex-none lg:block" />
          {doors.map((door) => (
            <DoorCard
              key={door.id}
              door={door}
              onEnter={enter}
              onHover={setHoverDoor}
              reduced={reduced}
            />
          ))}
          <div className="flex-none pr-[var(--gut)]" />
        </div>
      </div>

      {/* progress rail — laid into the skirting board so it reads as an inlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[2] hidden md:block">
        <div className="shell">
          <div className="h-px w-full bg-line">
            <div
              ref={railRef}
              className="h-px origin-left bg-fg/70 will-change-transform"
              style={{ transform: 'scaleX(0.18)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
