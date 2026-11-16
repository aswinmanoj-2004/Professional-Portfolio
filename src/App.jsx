import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { usePrefersReducedMotion, useTheme } from './lib/hooks';
import { useSmoothScroll } from './lib/smoothScroll';

import IntroSlide from './components/IntroSlide';
import FloatingNav from './components/FloatingNav';
import MenuOverlay from './components/MenuOverlay';
import ContactModal from './components/ContactModal';
import CursorGlow from './components/CursorGlow';
import BackToTop from './components/BackToTop';
import Curtain from './components/Curtain';
import ThemeFlash from './components/ThemeFlash';

import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import CertificateDetail from './pages/CertificateDetail';
import InternshipCertificatePage from './pages/InternshipCertificatePage';
import ExpertisePage from './pages/ExpertisePage';
import SelectedWorksPage from './pages/SelectedWorksPage';
import InternshipPage from './pages/InternshipPage';
import ProjectDetail from './pages/ProjectDetail';
import SkillPage from './pages/SkillPage';
import StoryPage from './pages/StoryPage';
import CertificationsPage from './pages/CertificationsPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

gsap.registerPlugin(ScrollTrigger);

/** Applies `[data-reveal]` fade/slide-up animations once per route render. */
function useScrollReveals(routeKey, reduced) {
  useEffect(() => {
    const nodes = gsap.utils.toArray('[data-reveal]');

    if (reduced) {
      gsap.set(nodes, { autoAlpha: 1, y: 0 });
      return undefined;
    }

    const triggers = nodes.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: Number(el.dataset.revealDelay || 0),
          }),
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, [routeKey, reduced]);
}

export default function App() {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();
  const { theme, toggle: toggleTheme, flashTo } = useTheme({ reduced });
  const [entered, setEntered] = useState(false);
  const [overlay, setOverlay] = useState({ visible: false, opaque: false });

  const enterPortfolio = () => {
    setOverlay({ visible: true, opaque: true });
    window.setTimeout(() => setEntered(true), 450);
    window.setTimeout(() => setOverlay({ visible: true, opaque: false }), 900);
    window.setTimeout(() => setOverlay({ visible: false, opaque: false }), 1400);
  };

  const goIntro = () => {
    setEntered(false);
    setOverlay({ visible: false, opaque: false });
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const contactRef = useRef(null);

  const lenisRef = useSmoothScroll({ enabled: !reduced });

  // Reveal elements before the first paint of a route, then hook up scroll triggers.
  useEffect(() => {
    const nodes = gsap.utils.toArray('[data-reveal]');
    if (nodes.length) gsap.set(nodes, { autoAlpha: 0, y: 34 });
  }, [location.pathname]);

  useScrollReveals(location.pathname, reduced);

  // Refresh ScrollTrigger after each route swap so pinned sections measure right.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 260);
    return () => window.clearTimeout(id);
  }, [location.pathname, entered]);

  // While the overlay menu is open, freeze background scrolling.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (menuOpen) lenis.stop();
      else lenis.start();
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen, lenisRef]);

  const openContact = () => contactRef.current?.open();
  const goDoors = () => setMenuOpen(false);

  const routes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home lenisRef={lenisRef} onContact={openContact} onDoors={goDoors} />} />
      <Route path="/expertise" element={<ExpertisePage onContact={openContact} />} />
      <Route path="/selected-works" element={<SelectedWorksPage onContact={openContact} />} />
      <Route path="/internship" element={<InternshipPage onContact={openContact} />} />
      <Route path="/projects" element={<ProjectsPage onContact={openContact} />} />
      <Route path="/projects/:id" element={<ProjectDetail onContact={openContact} />} />
      <Route path="/certificates/:id" element={<CertificateDetail onContact={openContact} />} />
      <Route path="/internship-certificate" element={<InternshipCertificatePage onContact={openContact} />} />
      <Route path="/frontend" element={<SkillPage slug="frontend" onContact={openContact} />} />
      <Route path="/full-stack" element={<SkillPage slug="full-stack" onContact={openContact} />} />
      <Route path="/databases" element={<SkillPage slug="databases" onContact={openContact} />} />
      <Route path="/ai" element={<SkillPage slug="ai" onContact={openContact} />} />
      <Route path="/ui-ux" element={<SkillPage slug="ui-ux" onContact={openContact} />} />
      <Route path="/story" element={<StoryPage onContact={openContact} />} />
      <Route path="/certifications" element={<CertificationsPage onContact={openContact} />} />
      <Route path="/contact" element={<ContactPage onContact={openContact} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {!entered && (
        <div className="fixed inset-0 z-[130]">
          <IntroSlide onExplore={enterPortfolio} />
        </div>
      )}

      {overlay.visible && (
        <div
          className="fixed inset-0 z-[125] bg-black transition-opacity duration-500"
          style={{ opacity: overlay.opaque ? 1 : 0 }}
        />
      )}

      {entered && (
        <>
          <CursorGlow reduced={reduced} />
          <FloatingNav theme={theme} onToggleTheme={toggleTheme} onBrandClick={goIntro} />

          <MenuOverlay
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onContact={openContact}
            reduced={reduced}
          />

          <main id="main" tabIndex={-1}>
            {routes}
          </main>

          <BackToTop lenisRef={lenisRef} />
        </>
      )}

      <ContactModal ref={contactRef} />
      <ThemeFlash to={flashTo} />
      <Curtain reduced={reduced} />
    </>
  );
}
