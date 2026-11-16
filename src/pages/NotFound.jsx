import { useEffect } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';
import { requestNavigate } from '../lib/nav';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.title = 'Page not found — Aswin Manoj';
  }, []);

  return (
    <PageTransition reduced={reduced} delay={0}>
      <section className="flex min-h-[100svh] items-center">
        <div className="shell">
          <p className="label">404</p>
          <h1 className="display h1 mt-4 max-w-[16ch]">This door isn’t on the wall.</h1>
          <button
            type="button"
            className="btn btn--solid mt-8"
            onClick={() => requestNavigate('/')}
          >
            Back to the doors <span aria-hidden="true">←</span>
          </button>
        </div>
      </section>
    </PageTransition>
  );
}
