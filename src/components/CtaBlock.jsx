import { ctaSection } from '../data/portfolio';
import Magnetic from './Magnetic';
import { hasSection, scrollToId } from '../lib/smoothScroll';
import { requestNavigate } from '../lib/nav';

/** Repeated on every page: availability line + the two primary CTAs. */
export default function CtaBlock({ lenisRef, onContact }) {
  const seeWork = () => {
    if (hasSection('doors')) scrollToId(lenisRef, 'doors', -20);
    else requestNavigate('/');
  };
  return (
    <section id="cta" className="section border-t border-line">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div data-reveal>
          <p className="label">Start here</p>
          <h2 className="display h2 mt-4 max-w-[15ch]">
            <span className="block">{ctaSection.line1}</span>
            <span className="soft">{ctaSection.line2}</span>
          </h2>
        </div>

        <div data-reveal data-reveal-delay="0.1" className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Magnetic strength={0.2}>
            <button type="button" className="btn btn--solid" onClick={onContact}>
              Start a project <span className="btn__arrow">↗</span>
            </button>
          </Magnetic>
          <Magnetic strength={0.16}>
            <button type="button" className="btn btn--ghost" onClick={seeWork}>
              See my work <span aria-hidden="true">↓</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
