import { useEffect } from 'react';
import { contactSection, profile } from '../data/portfolio';
import { usePrefersReducedMotion, useLocalTime } from '../lib/hooks';
import Magnetic from '../components/Magnetic';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function ContactPage({ onContact }) {
  const reduced = usePrefersReducedMotion();
  const time = useLocalTime(profile.timezone);

  useEffect(() => {
    document.title = 'Contact — Aswin Manoj';
    return () => {
      document.title = 'Aswin Manoj — Frontend / Full-Stack Developer with an AI focus';
    };
  }, []);

  const lines = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { label: 'LinkedIn', value: 'aswin-manoj-acc', href: profile.linkedin, external: true },
    { label: 'GitHub', value: 'aswinmanoj-2004', href: profile.github, external: true },
    { label: 'Resume', value: 'Download PDF', href: profile.resume, download: true },
  ];

  return (
    <PageTransition reduced={reduced} delay={0}>
      <section className="pb-10 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <p className="label">{contactSection.eyebrow}</p>
          <h1 className="display h1 mt-4 max-w-[13ch]">
            <span className="block">{contactSection.title}</span>
            <span className="soft">{contactSection.sub}</span>
          </h1>

          <p className="lede mt-6 max-w-[46ch]">
            {profile.availability} Tell me what you need built and I’ll reply within one business day.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <button type="button" className="btn btn--solid" onClick={onContact}>
                Start a project <span className="btn__arrow">↗</span>
              </button>
            </Magnetic>
            <Magnetic strength={0.16}>
              <a href={`mailto:${profile.email}`} className="btn btn--ghost">
                Email directly <span className="btn__arrow">↗</span>
              </a>
            </Magnetic>
          </div>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {lines.map((line) => (
              <div key={line.label} className="bg-panel p-6">
                <dt className="font-mono text-[0.625rem] uppercase tracking-label text-clay">
                  {line.label}
                </dt>
                <dd className="mt-3">
                  <a
                    href={line.href}
                    target={line.external ? '_blank' : undefined}
                    rel={line.external ? 'noopener noreferrer' : undefined}
                    download={line.download || undefined}
                    className="break-all text-[0.9375rem] text-fg transition-colors duration-300 hover:text-ember"
                  >
                    {line.value} {line.external && <span aria-hidden="true">↗</span>}
                    {line.download && <span aria-hidden="true"> ↓</span>}
                  </a>
                </dd>
              </div>
            ))}

            <div className="bg-panel p-6">
              <dt className="font-mono text-[0.625rem] uppercase tracking-label text-clay">
                Local time
              </dt>
              <dd className="mt-3 text-[0.9375rem] tabular-nums text-fg">
                {time} <span className="text-faint">IST</span>
              </dd>
            </div>
          </dl>

          <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
            {profile.location}
          </p>
        </div>
      </section>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
