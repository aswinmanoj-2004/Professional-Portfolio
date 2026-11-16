import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { projects, doorsIntro } from '../data/portfolio';
import { requestNavigate } from '../lib/nav';

gsap.registerPlugin(ScrollTrigger, Draggable);

const AJAR = 14;
const HINGE = 58;
const DIVE_MS = 1200;
const PALETTE = [
  { paint: '#2C3E63', shade: '#16213A' },
  { paint: '#4B2E45', shade: '#2A1727' },
  { paint: '#6C7F5D', shade: '#3B4932' },
  { paint: '#A9512B', shade: '#5F2C16' },
  { paint: '#8B6A2E', shade: '#4E3917' },
];

function plateFor(project) {
  const words = project.title.split(' ').filter(Boolean);
  const first = (words[0] || 'PROJECT').toUpperCase().slice(0, 12);
  const second = (words[1] || 'DOOR').toUpperCase().slice(0, 12);
  return [first, second];
}

const doorContent = {
  'digital-library': {
    intro: 'A publishing platform where readers browse a managed story library and creators upload, edit and release their own digital assets.',
    bullets: [
      'Secure PHP/MySQL backend managing digital assets and story databases',
      'Multi-role authentication (readers vs publishers) with permission management',
      'Dynamic story upload system for content creators',
    ],
  },
  'aquarium-store': {
    intro: 'A complete storefront for aquarium stock: browse the catalogue, manage inventory and check out, with an admin side for the shop.',
    bullets: [
      'Full e-commerce app with inventory tracking and user management',
      'Clean browse and checkout flow built on ASP.NET / C#',
    ],
  },
  certificates: {
    intro: 'Seven certificates across frontend, AI, full-stack and design.',
    bullets: [
      'Professional certificates from HackerRank, Coursera, Anthropic and Simplilearn',
      'Technical achievements in React, AI, full-stack and UI/UX',
      'Google Drive certificate access for each credential',
    ],
  },
  internship: {
    intro: 'Frontend Web Application Developer internship at NeST Digital Academy.',
    bullets: [
      'NeST Digital Academy internship experience',
      'Component-driven Angular applications, services and routing',
      'Internship certificate available to view',
    ],
  },
};

const projectDoors = [
  ...projects
    .filter((p) => p.id === 'digital-library' || p.id === 'aquarium-store')
    .map((p, i) => ({
      id: p.id,
      title: p.title,
      label: 'Selected Work',
      path: `/projects/${p.id}`,
      paint: PALETTE[i % PALETTE.length].paint,
      shade: PALETTE[i % PALETTE.length].shade,
      plate: plateFor(p),
      blurb: p.description,
      content: doorContent[p.id],
    })),
  {
    id: 'certificates',
    title: 'Certifications',
    label: 'Credentials',
    path: '/certifications',
    paint: PALETTE[2].paint,
    shade: PALETTE[2].shade,
    plate: ['CERTIFICATES', 'VIEW ALL'],
    blurb: 'Seven certificates across frontend, AI, full-stack and design.',
    content: doorContent.certificates,
  },
  {
    id: 'internship',
    title: 'Internship',
    label: 'Internship',
    path: '/internship',
    paint: PALETTE[3].paint,
    shade: PALETTE[3].shade,
    plate: ['INTERNSHIP', 'NEST DIGITAL'],
    blurb: 'Frontend Web Application Developer internship at NeST Digital Academy.',
    content: doorContent.internship,
  },
];

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
      <span className="absolute right-[6%] top-[54%] z-[2] flex items-center">
        <span className="brass h-[7px] w-[30%] min-w-[26px] rounded-l-full rounded-r-[2px]" />
        <span className="brass h-4 w-4 rounded-full" />
      </span>
      <span className="brass absolute right-[9%] top-[63%] z-[2] flex h-9 w-[15px] flex-col items-center justify-center rounded-full">
        <span className="h-[6px] w-[6px] rounded-full bg-[#2b1d07]" />
        <span className="-mt-[1px] h-[11px] w-[3px] rounded-b-[2px] bg-[#2b1d07]" />
      </span>
    </>
  );
}

function DoorCard({ door, onFocus, onHover, reduced, isFocused, onNavigate }) {
  const unitRef = useRef(null);

  const go = () => {
    if (isFocused) {
      onNavigate(door);
    } else {
      onFocus(door.id);
    }
  };

  const angle = reduced ? 0 : isFocused ? HINGE : 0;

  return (
    <article
      ref={unitRef}
      data-hovered={isFocused}
      className="door-unit group relative h-[clamp(19rem,62vh,30rem)] w-[clamp(13rem,24vw,16.5rem)] flex-none cursor-pointer sm:snap-center"
      style={{ perspective: '1100px' }}
      onMouseEnter={() => onHover(door.id)}
      onClick={go}
    >
      <div className="door-frame absolute inset-0" />
      <div className="door-interior absolute inset-[9px] overflow-hidden">
        <span className="door-room" aria-hidden="true" />
        <span className="door-threshold" aria-hidden="true" style={{ opacity: open ? 1 : 0.55 }} />
        <span className="door-cast" aria-hidden="true" style={{ opacity: open ? 1 : 0.62 }} />
        <span
          className="door-behind-text absolute inset-x-4 bottom-6 z-[1] text-center text-sm leading-relaxed text-fg/85"
          style={{ opacity: 0 }}
        >
          {door.blurb}
        </span>
      </div>
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
          transform: `rotateY(${angle}deg)`,
        }}
      >
        <Hardware plate={door.plate} />
      </div>
    </article>
  );
}

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

function Typewriter({ text, speed = 30, onDone, className = '' }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    setDisplay('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);
  return <span className={className}>{display}</span>;
}

function SideReveal({ door, onExplore, onClose }) {
  const [stage, setStage] = useState(0); // 0 label,1 heading,2 desc,3 bullets
  useEffect(() => {
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 200 + (door.title.length * 30) + 200);
    const t3 = setTimeout(() => setStage(3), 200 + (door.title.length * 30) + 200 + (door.content.intro.length * 20) + 200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [door]);

  return (
    <div className="text-right">
      <p className="font-mono text-[0.6875rem] uppercase tracking-label text-ember/90">
        {door.label}
      </p>
      {stage >= 1 && (
        <h3 className="display mt-2 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-tight text-white">
          <Typewriter text={door.title} speed={40} />
        </h3>
      )}
      {stage >= 2 && (
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          <Typewriter text={door.content?.intro || ''} speed={18} />
        </p>
      )}
      {stage >= 3 && (
        <ul className="mt-4 space-y-2">
          {(door.content?.bullets || []).map((b, i) => (
            <li key={b} className="text-sm leading-relaxed text-white/70">
              · {b}
            </li>
          ))}
        </ul>
      )}
      {stage >= 3 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-[0.8125rem] text-white/50 transition-colors hover:text-white"
          >
            Close ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProjectDoors({ reduced, coarse }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const diveRef = useRef(null);
  const railRef = useRef(null);
  const diveTimer = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [navigating, setNavigating] = useState(null);
  const [overPanel, setOverPanel] = useState(false);
  const leaveTimer = useRef(null);
  const hoveredDoor = projectDoors.find((d) => d.id === hovered) || null;

  const scheduleClear = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      if (!overPanel) setHovered(null);
    }, 200);
  };
  const cancelClear = () => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  };

  const navigateDoor = (door) => {
    setNavigating(door.id);
    window.setTimeout(() => requestNavigate(door.path), DIVE_MS);
  };

  useEffect(() => () => window.clearTimeout(diveTimer.current), []);

  // No horizontal scroll: doors are laid out in a simple wrapping row.

  const enter = (path, rect) => {
    if (reduced) return requestNavigate(path);
    const box = diveRef.current?.getBoundingClientRect();
    if (box && rect) {
      diveRef.current.style.setProperty('--dive-x', `${rect.left + rect.width / 2 - box.left}px`);
      diveRef.current.style.setProperty('--dive-y', `${rect.top + rect.height / 2 - box.top}px`);
    }
    window.clearTimeout(diveTimer.current);
    diveTimer.current = window.setTimeout(() => requestNavigate(path), DIVE_MS);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`doors-viewport relative isolate flex flex-col overflow-hidden ${
        hovered ? 'is-hovering' : ''
      } ${navigating ? 'is-diving' : ''}`}
    >
      <span aria-hidden="true" className={`door-veil ${navigating ? 'is-on' : ''}`} />

      <div className="shell shrink-0 pt-[calc(var(--bar-h)+1rem)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="label">Projects</p>
            <h2 className="display mt-2 text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              Walk into a door
            </h2>
          </div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-label text-faint">
            Swipe along the wall <span aria-hidden="true">+</span>
          </p>
        </div>
      </div>

      <div className="wall-base" aria-hidden="true" />

      {hoveredDoor && (
        <aside
          className="fixed right-8 top-1/2 z-[60] w-full max-w-md -translate-y-1/2"
          onMouseEnter={() => { cancelClear(); setOverPanel(true); }}
          onMouseLeave={() => { setOverPanel(false); scheduleClear(); }}
        >
          <SideReveal
            key={hoveredDoor.id}
            door={hoveredDoor}
            onClose={() => setHovered(null)}
          />
        </aside>
      )}

      <div ref={diveRef} className="doors-dive">
        <div
          ref={trackRef}
          className="doors-track relative z-[1] flex flex-wrap justify-center gap-6 pt-6 pb-[2.25rem]"
          onMouseLeave={scheduleClear}
        >
          {projectDoors.map((door) => (
            <DoorCard
              key={door.id}
              door={door}
              onFocus={setHovered}
              onHover={setHovered}
              reduced={reduced}
              isFocused={hovered === door.id}
              onNavigate={navigateDoor}
            />
          ))}

        </div>
      </div>


    </section>
  );
}
