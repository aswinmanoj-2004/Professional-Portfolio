import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { skillPages } from '../data/portfolio';
import { usePrefersReducedMotion, useIsCoarsePointer } from '../lib/hooks';
import { requestNavigate } from '../lib/nav';
import ProjectList from '../components/ProjectList';
import CertGrid from '../components/CertGrid';
import CtaBlock from '../components/CtaBlock';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import Magnetic from '../components/Magnetic';

const EASE = [0.16, 1, 0.3, 1];

export default function SkillPage({ slug, onContact }) {
  const page = skillPages[slug];
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();

  useEffect(() => {
    if (!page) return undefined;
    document.title = `${page.title} — Aswin Manoj`;
    return () => {
      document.title = 'Aswin Manoj — Frontend / Full-Stack Developer with an AI focus';
    };
  }, [page]);

  if (!page) return null;

  const back = (event) => {
    event.preventDefault();
    requestNavigate('/');
  };

  return (
    <PageTransition reduced={reduced} delay={0}>
      <section className="relative overflow-hidden pb-6 pt-[calc(var(--bar-h)+4rem)]">
        {/* page-tinted ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${page.accent}26 0%, rgba(228,102,90,0) 68%)`,
          }}
        />

        <div className="shell">
          <Magnetic strength={0.14}>
            <Link
              to="/"
              onClick={back}
              className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-label text-muted transition-colors duration-300 hover:text-ember"
            >
              <span aria-hidden="true">←</span> Back to the doors
            </Link>
          </Magnetic>

          <motion.p
            className="label mt-8"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          >
            Skill page
          </motion.p>

          <motion.h1
            className="display h1 mt-4 max-w-[15ch]"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          >
            {page.title}
          </motion.h1>

          <motion.p
            className="lede mt-6 max-w-[52ch]"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
          >
            {page.lede}
          </motion.p>

          <motion.ul
            className="mt-8 flex flex-wrap gap-2"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.34 }}
          >
            {page.skills.map((skill) => (
              <li key={skill} className="chip">
                {skill}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <ProjectList slug={slug} coarse={coarse} reduced={reduced} />
      <CertGrid />
      <CtaBlock onContact={onContact} />
      <Footer onContact={onContact} />
    </PageTransition>
  );
}
