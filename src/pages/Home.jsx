import { usePrefersReducedMotion, useIsCoarsePointer } from '../lib/hooks';
import { profile } from '../data/portfolio';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import ProjectDoors from '../components/ProjectDoors';
import TechStack from '../components/TechStack';
import CertGrid from '../components/CertGrid';
import CtaBlock from '../components/CtaBlock';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function Home({ lenisRef, onContact }) {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();

  return (
    <PageTransition reduced={reduced} delay={0}>
      <Hero lenisRef={lenisRef} onContact={onContact} reduced={reduced} />
      <section id="profile" className="section">
        <div className="shell">
          <p className="label">Profile</p>
          <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed text-muted">
            {profile.summary}
          </p>
        </div>
      </section>
      <Timeline reduced={reduced} coarse={coarse} />
      <ProjectDoors reduced={reduced} coarse={coarse} />
      <TechStack />
      <CertGrid />
      <CtaBlock lenisRef={lenisRef} onContact={onContact} />
      <Footer lenisRef={lenisRef} onContact={onContact} />
    </PageTransition>
  );
}
