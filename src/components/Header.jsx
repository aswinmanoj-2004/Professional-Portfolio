import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { profile, topNav } from '../data/portfolio';
import { useLocalClock } from '../lib/hooks';
import { scrollToId } from '../lib/smoothScroll';
import { requestNavigate } from '../lib/nav';

/** Desktop nav row; collapses to the Menu button on small screens.
 *  Plain Link navigation is intentional — Curtain wipes on any location change. */
function NavBar() {
  return (
    <nav aria-label="Primary" className="hidden flex-wrap items-center justify-end gap-1 lg:flex">
      {topNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `relative px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-300 ${
              isActive ? 'text-fg' : 'text-muted hover:text-fg'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-ember transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

/** Sun/moon mark that rotates between the two states. */
function ThemeGlyph({ light }) {
  return (
    <span aria-hidden="true" className="relative grid h-4 w-4 place-items-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          light ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
        }`}
      >
        <circle cx="12" cy="12" r="4.4" />
        <path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          light ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
        }`}
      >
        <path d="M20.6 14.3A8.7 8.7 0 0 1 9.7 3.4a8.8 8.8 0 1 0 10.9 10.9z" />
      </svg>
    </span>
  );
}

export default function Header({ onMenu, lenisRef, theme, onToggleTheme }) {
  const [stuck, setStuck] = useState(false);
  const location = useLocation();
  const { time, date } = useLocalClock(profile.timezone);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goHome = (event) => {
    event.preventDefault();
    const atTop = window.scrollY < 80;
    if (atTop) {
      scrollToId(lenisRef, 'hero', 0);
      return;
    }
    requestNavigate('/');
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        stuck
          ? 'bg-bg/70 shadow-[0_1px_0_var(--line)] backdrop-blur-xl'
          : 'bg-bg/40 backdrop-blur-xl'
      }`}
    >
      <div className="shell flex h-[var(--bar-h)] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <Link
            to="/"
            onClick={goHome}
            aria-label={`${profile.name} — home`}
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.01em]"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ember text-[0.6875rem] font-bold text-bg transition-transform duration-500 group-hover:rotate-[-12deg]">
              A
            </span>
            <span>{profile.name}</span>
          </Link>

          <NavBar />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <p className="hidden items-center gap-2.5 rounded-pill border border-line bg-panel/60 px-4 py-1.5 font-mono text-[0.625rem] uppercase tracking-label text-faint md:flex">
            <span>Local time</span>
            <span className="tabular-nums normal-case tracking-normal text-fg">{time}</span>
            <span aria-hidden="true">·</span>
            <span className="normal-case tracking-normal text-rose/90">{date}</span>
          </p>

          {/* The cord is the playful switch, but it only hangs in the hero and never
              on small screens, so the header carries the reachable copy. */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Turn the lights on' : 'Turn the lights off'}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-line bg-panel/60 text-fg transition-colors duration-300 hover:border-ember/70 hover:text-ember"
          >
            <ThemeGlyph light={theme === 'light'} />
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="btn btn--ghost !py-2 !px-4 text-[0.8125rem] lg:hidden"
            aria-haspopup="dialog"
          >
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="block h-[1.5px] w-4 rounded-full bg-current" />
              <span className="block h-[1.5px] w-4 rounded-full bg-current" />
            </span>
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
