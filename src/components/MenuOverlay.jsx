import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, profile, workLinks } from '../data/portfolio';
import { useLocalTime } from '../lib/hooks';
import { requestNavigate } from '../lib/nav';

const EASE = [0.22, 1, 0.36, 1];

/** Full-screen overlay navigation with a staggered link reveal. */
export default function MenuOverlay({ open, onClose, onContact, reduced }) {
  const panelRef = useRef(null);
  const time = useLocalTime(profile.timezone);

  // Focus management + ESC to close.
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;
    const node = panelRef.current;
    const focusables = () =>
      Array.from(
        node?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ||
          [],
      ).filter((el) => el.offsetParent !== null);

    window.setTimeout(() => focusables()[0]?.focus(), 260);

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  const jump = (event, to) => {
    event.preventDefault();
    onClose();
    requestNavigate(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[120] flex flex-col bg-bg"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: reduced ? 0.01 : 0.6, ease: EASE }}
        >
          <div className="shell flex h-[var(--bar-h)] items-center justify-between">
            <span className="label label--plain">Navigate</span>
            <button type="button" onClick={onClose} className="btn btn--ghost !py-2 !px-4 text-[0.8125rem]">
              Close ✕
            </button>
          </div>

          <div className="shell flex flex-1 flex-col justify-center gap-10 overflow-y-auto py-8">
            <nav aria-label="Main">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={reduced ? false : { y: 44, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.055 }}
                    className="border-b border-line first:border-t"
                  >
                    <a
                      href={link.to}
                      onClick={(e) => jump(e, link.to)}
                      className="group flex items-baseline gap-4 py-3 sm:py-4"
                    >
                      <span className="font-mono text-[0.625rem] uppercase tracking-label text-faint">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="h3 display transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-2 group-hover:text-ember">
                        {link.label}
                      </span>
                      <span className="ml-auto text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        ↗
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="grid gap-8 sm:grid-cols-2"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div>
                <p className="label label--plain mb-3">Work</p>
                <ul className="space-y-1.5">
                  {workLinks.map((link) => (
                    <li key={link.to}>
                      <a
                        href={link.to}
                        onClick={(e) => jump(e, link.to)}
                        className="text-sm text-muted transition-colors hover:text-ember"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="label label--plain mb-3">Direct</p>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <button type="button" onClick={onContact} className="text-muted hover:text-ember">
                      Start a project
                    </button>
                  </li>
                  <li>
                    <a
                      href={profile.resume}
                      download
                      className="text-muted transition-colors hover:text-ember"
                    >
                      Download resume ↓
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-muted transition-colors hover:text-ember"
                    >
                      {profile.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-ember"
                    >
                      LinkedIn ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-ember"
                    >
                      GitHub ↗
                    </a>
                  </li>
                </ul>
                <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
                  Local time {time} IST
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
