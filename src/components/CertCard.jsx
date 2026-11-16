import { Link } from 'react-router-dom';
import { resolveUrl } from '../data/portfolio';

/** Certification card — the whole card is one link opening the dedicated viewing page. */
export default function CertCard({ cert }) {
  return (
    <Link
      to={`/certificates/${cert.id}`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-card border border-line bg-panel p-6 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] will-change-transform hover:-translate-y-1.5 hover:border-ember/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_36px_rgba(228,102,90,0.14)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle, rgba(228,102,90,0.28), rgba(228,102,90,0) 70%)' }}
      />

      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[0.6875rem] uppercase tracking-label text-clay">
          {cert.issuer}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-label text-faint">
          Verified
        </span>
      </div>

      <div className="mt-10">
        <h3 className="display text-[clamp(1.15rem,1.8vw,1.5rem)]">{cert.title}</h3>

        <p className="mt-4 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-label text-rose transition-colors duration-300 group-hover:text-ember">
          View certificate
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            ↗
          </span>
        </p>
      </div>
    </Link>
  );
}
