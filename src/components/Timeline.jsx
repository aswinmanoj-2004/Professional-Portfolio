import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { storySection, timeline } from '../data/portfolio';
import DigitRoller from './DigitRoller';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven story timeline: the year panel holds in place while the steps
 * advance past it, with a rolling-digit year counter, a "01 / 05" step meter
 * and an ember glow that travels to the active step.
 *
 * The panel is held with position: sticky rather than a fixed GSAP pin, because a
 * fixed pin at `top top` clips the last steps on short viewports. Sticky keeps the
 * same reading of "pinned while time rolls" at every screen height and is
 * transform-free on the scroll path.
 */
export default function Timeline({ reduced }) {
  const [step, setStep] = useState(0);
  const sectionRef = useRef(null);
  const columnRef = useRef(null);
  const listRef = useRef(null);
  const glowRef = useRef(null);
  const stepRef = useRef(0);

  const total = timeline.length;
  const active = timeline[Math.min(step, total - 1)];

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // The step whose row sits closest to the middle of the viewport is the active one.
  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return undefined;

    const compute = () => {
      const rows = Array.from(list.children);
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      rows.forEach((row, i) => {
        const rect = row.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (best !== stepRef.current) setStep(best);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: compute,
      onRefresh: compute,
    });
    compute();

    return () => trigger.kill();
  }, [total]);

  // Slide the ember glow to the active list row.
  useEffect(() => {
    const list = listRef.current;
    const column = columnRef.current;
    const glow = glowRef.current;
    if (!list || !column || !glow) return;
    const row = list.children[step];
    if (!row) return;
    const top = list.offsetTop + row.offsetTop + row.offsetHeight / 2;
    glow.style.transform = `translate3d(0, ${top}px, 0)`;
  }, [step]);

  const counter = `${String(step + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative isolate border-y border-line py-[clamp(4rem,10vw,7rem)]"
      style={{ background: 'var(--bg-deep)' }}
    >
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        {/* left: clock panel, held in place while the steps scroll past */}
        <div className="relative flex flex-col justify-between gap-8 lg:sticky lg:top-[calc(var(--bar-h)+3rem)] lg:self-start">
          <div>
            <p className="label">{storySection.eyebrow}</p>
            <h2 className="display h2 mt-3 max-w-[12ch]">{storySection.title}</h2>
          </div>

          <div>
            <p className="font-mono text-[0.8125rem] uppercase tracking-label text-clay">
              {active.range}
            </p>
            <DigitRoller
              value={active.year}
              className="display mt-1 text-[clamp(3.4rem,15vw,9rem)] leading-[0.9] text-fg"
            />
            <p className="mt-4 font-mono text-[0.8125rem] uppercase tracking-label text-faint">
              {counter}
            </p>
            <div className="mt-4 h-px w-full bg-line">
              <div
                className="h-px origin-left bg-ember transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] will-change-transform"
                style={{ transform: `scaleX(${(step + 1) / total})` }}
              />
            </div>
          </div>

          <p className="max-w-[34ch] text-sm leading-relaxed text-muted lg:hidden">
            {active.points[0]}
          </p>
        </div>

        {/* right: step list with travelling glow */}
        <div ref={columnRef} className="relative">
          <div
            ref={glowRef}
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 h-0 w-full will-change-transform ${
              reduced ? '' : 'transition-transform duration-[700ms] ease-[cubic-bezier(.16,1,.3,1)]'
            }`}
          >
            <div
              className="relative -top-24 h-48 w-full"
              style={{
                background:
                  'radial-gradient(50% 60% at 18% 50%, rgba(228,102,90,0.22) 0%, rgba(228,102,90,0) 72%)',
              }}
            />
          </div>

          <ol ref={listRef} className="relative space-y-1">
            {timeline.map((item, i) => {
              const isActive = i === step;
              return (
                <li
                  key={item.id}
                  className={`group cursor-default border-t border-line py-5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:flex lg:min-h-[56vh] lg:items-center lg:py-6 ${
                    isActive ? 'opacity-100' : 'opacity-45 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-1.5 h-2 w-2 flex-none rounded-full transition-all duration-500 ${
                        isActive ? 'bg-ember shadow-[0_0_12px_rgba(228,102,90,0.9)]' : 'bg-rose/35'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-label text-clay">
                        {item.kind} · {item.range}
                      </p>
                      <h3 className="display mt-1.5 text-[clamp(1.25rem,2.4vw,1.85rem)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-rose/90">{item.org}</p>
                      <ul className="mt-2.5 space-y-1.5">
                        {item.points.map((point) => (
                          <li key={point} className="max-w-[52ch] text-sm leading-relaxed text-muted">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
