import { useEffect } from 'react';
import { storySection, timeline } from '../data/portfolio';
import { usePrefersReducedMotion } from '../lib/hooks';
import DigitRoller from '../components/DigitRoller';
import CertGrid from '../components/CertGrid';
import CtaBlock from '../components/CtaBlock';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

/** Standalone story route: the same entries as a plain scrolling list. */
export default function StoryPage({ onContact }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.title = 'My story — Aswin Manoj';
    return () => {
      document.title = 'Aswin Manoj — Frontend / Full-Stack Developer with an AI focus';
    };
  }, []);

  return (
    <PageTransition reduced={reduced} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <p className="label">{storySection.eyebrow}</p>
          <h1 className="display h1 mt-4 max-w-[14ch]">{storySection.title}</h1>
          <p className="lede mt-6 max-w-[50ch]">
            Five markers, newest first — from the Angular work I’m doing now back to the school
            where the first web page got built.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell">
          <ol>
            {timeline.map((item, i) => (
              <li
                key={item.id}
                data-reveal
                data-reveal-delay={i * 0.05}
                className="grid gap-5 border-t border-line py-8 sm:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] sm:gap-10 lg:py-10"
              >
                <div>
                  <DigitRoller
                    value={item.year}
                    className="display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] text-fg"
                  />
                  <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-label text-clay">
                    {item.range}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[0.625rem] uppercase tracking-label text-rose">
                    {item.kind}
                  </p>
                  <h2 className="display mt-2 text-[clamp(1.3rem,2.6vw,2rem)]">{item.title}</h2>
                  <p className="mt-1.5 text-sm text-rose/90">{item.org}</p>
                  <ul className="mt-4 space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none rounded-full bg-ember" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <div className="hairline" />
        </div>
      </section>

      <CertGrid />
      <CtaBlock onContact={onContact} />
      <Footer onContact={onContact} />
    </PageTransition>
  );
}
