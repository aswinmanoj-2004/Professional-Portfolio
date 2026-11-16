import { useEffect } from 'react';
import { certifications, certificationsSection, profile } from '../data/portfolio';
import { usePrefersReducedMotion, useIsCoarsePointer } from '../lib/hooks';
import CertCard from '../components/CertCard';
import Timeline from '../components/Timeline';
import CtaBlock from '../components/CtaBlock';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function CertificationsPage({ onContact }) {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();

  useEffect(() => {
    document.title = 'Certifications — Aswin Manoj';
    return () => {
      document.title = 'Aswin Manoj — Frontend / Full-Stack Developer with an AI focus';
    };
  }, []);

  return (
    <PageTransition reduced={reduced} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <p className="label">{certificationsSection.eyebrow}</p>
          <h1 className="display h1 mt-4 max-w-[13ch]">{certificationsSection.title}</h1>
          <p className="lede mt-6 max-w-[50ch]">{certificationsSection.sub}</p>

          <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
            {certifications.length} certificates · issuer · {profile.location}
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <li key={cert.id} data-reveal data-reveal-delay={(i % 3) * 0.08}>
                <CertCard cert={cert} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Timeline reduced={reduced} coarse={coarse} />
      <CtaBlock onContact={onContact} />
      <Footer onContact={onContact} />
    </PageTransition>
  );
}
