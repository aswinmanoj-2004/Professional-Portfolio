import { Link } from 'react-router-dom';
import { navLinks, profile, workLinks } from '../data/portfolio';
import { useLocalTime } from '../lib/hooks';
import { scrollToId } from '../lib/smoothScroll';
import { requestNavigate } from '../lib/nav';

export default function Footer({ lenisRef, onContact }) {
  const time = useLocalTime(profile.timezone);
  const year = new Date().getFullYear();

  const jump = (event, to) => {
    event.preventDefault();
    requestNavigate(to);
  };

  return (
    <footer className="relative border-t border-line pt-16">
      <div className="shell">
        <div className={`grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(${workLinks.length > 0 ? 3 : 2},minmax(0,1fr))]`}>
          {/* brand + status */}
          <div>
            <p className="display text-[clamp(1.6rem,3vw,2.4rem)]">{profile.name}</p>
            <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-muted">{profile.role}</p>

            <div className="mt-6 space-y-2 text-sm">
              <p className="chip chip--live !inline-flex">
                <i aria-hidden="true" /> Available for work
              </p>
              <p className="font-mono text-[0.6875rem] uppercase tracking-label text-faint">
                Remote-friendly · {profile.location}
              </p>
              <p className="font-mono text-[0.6875rem] uppercase tracking-label text-faint">
                Local time <span className="text-fg/80 tabular-nums">{time}</span> IST
              </p>
            </div>
          </div>

          {workLinks.length > 0 && (
            <nav aria-label="Work">
              <p className="label label--plain mb-4">Work</p>
              <ul className="space-y-2">
                {workLinks.map((link) => (
                  <li key={link.to}>
                    <a
                      href={link.to}
                      onClick={(e) => jump(e, link.to)}
                      className="text-sm text-muted transition-colors duration-300 hover:text-ember"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* navigate */}
          <nav aria-label="Navigate">
            <p className="label label--plain mb-4">Navigate</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <a
                    href={link.to}
                    onClick={(e) => jump(e, link.to)}
                    className="text-sm text-muted transition-colors duration-300 hover:text-ember"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* direct */}
          <div>
            <p className="label label--plain mb-4">Direct</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all text-muted transition-colors duration-300 hover:text-ember"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phone}`}
                  className="text-muted transition-colors duration-300 hover:text-ember"
                >
                  {profile.phone}
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors duration-300 hover:text-ember"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors duration-300 hover:text-ember"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href={profile.resume}
                  download
                  className="text-muted transition-colors duration-300 hover:text-ember"
                >
                  Download resume ↓
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onContact}
                  className="text-rose transition-colors duration-300 hover:text-ember"
                >
                  Start a project ↗
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          <p className="font-mono text-[0.6875rem] uppercase tracking-label text-faint">
            © {year} {profile.name}
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => scrollToId(lenisRef, 'hero', -10)}
              className="font-mono text-[0.6875rem] uppercase tracking-label text-muted transition-colors hover:text-ember"
            >
              Back to top ↑
            </button>
            <Link
              to="/contact"
              onClick={(e) => jump(e, '/contact')}
              className="font-mono text-[0.6875rem] uppercase tracking-label text-muted transition-colors hover:text-ember"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
