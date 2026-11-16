import { Link } from 'react-router-dom';
import { profile } from '../data/portfolio';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function InternshipPage({ onContact }) {
  return (
    <PageTransition reduced={false} delay={0}>
      <section className="relative overflow-hidden pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
        <div className="shell">
          <p className="label">Internship</p>
          <h1 className="display h1 mt-4 max-w-[16ch]">NeST Digital Academy</h1>
          <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-label text-rose">
            Frontend Web Application Developer — Internship
          </p>
          <p className="lede mt-6 max-w-[55ch]">
            A hands-on internship focused on building responsive, production-style web applications with
            Angular — component-driven architecture, services, routing and review flows.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-4">
            <div className="rounded-card border border-line bg-panel p-6">
              <p className="label label--plain">What I did</p>
              <ul className="mt-4 space-y-3">
                {[
                  'Developed a responsive web application using Angular, enhancing user engagement by X% through modern design and efficient coding practices.',
                  'Built component-driven Angular applications with services and routing.',
                  'Worked with production-style codebases and review flows.',
                ].map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-fg/80">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-ember" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Organisation', value: 'NeST Digital Academy' },
                { label: 'Role', value: 'Frontend Web Application Developer (Internship)' },
                { label: 'Focus', value: 'Angular · Responsive UI · Production codebases' },
                { label: 'Location', value: profile.location },
              ].map((item) => (
                <div key={item.label} className="rounded-card border border-line bg-panel p-5">
                  <p className="label label--plain">{item.label}</p>
                  <p className="mt-2 text-sm text-fg/80">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-card border border-line bg-panel p-6">
              <p className="label label--plain">Certificates</p>
              <p className="mt-3 text-sm text-muted">
                Two documents are available: the course completion certificate and the internship certificate.
              </p>
              <Link
                to="/internship-certificate"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-5 py-2.5 text-[0.8125rem] font-medium text-ember transition-colors hover:bg-ember hover:text-bg"
              >
                View Certificates <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="rounded-card border border-line bg-panel p-6">
              <p className="label label--plain">Tech Stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Angular', 'TypeScript', 'HTML', 'CSS', 'JavaScript'].map((t) => (
                  <span key={t} className="chip !py-1 !px-3 text-[0.6875rem]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell">
          <p className="label">Featured Internship Project</p>
          <div className="mt-6 overflow-hidden rounded-card border border-line bg-panel">
            <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <div>
                <span className="font-mono text-[0.625rem] uppercase tracking-label text-clay">
                  Internship Project · Angular
                </span>
                <h3 className="display mt-3 text-[clamp(1.5rem,3vw,2.2rem)]">AnimeWorld</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  An Angular web application built during the NeST Digital Academy internship, scaffolded with
                  Angular CLI and deployed on Vercel. Source code is available on GitHub.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Angular', 'TypeScript', 'HTML', 'CSS'].map((t) => (
                    <span key={t} className="chip !py-1 !px-3 text-[0.6875rem]">{t}</span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://final-pied-nu.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--solid !py-2.5 !px-4 text-[0.8125rem]"
                  >
                    Live Preview <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/aswinachu1927-svg/final"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
                  >
                    View Source Code <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              <div className="overflow-hidden rounded-card border border-line bg-bg-deep">
                <iframe
                  src="https://final-pied-nu.vercel.app/"
                  title="AnimeWorld preview"
                  className="h-[22rem] w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
