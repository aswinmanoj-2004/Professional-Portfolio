import { skillGroups, profile } from '../data/portfolio';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function ExpertisePage({ onContact }) {
  return (
    <PageTransition reduced={false} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <p className="label">Expertise</p>
          <h1 className="display h1 mt-4 max-w-[13ch]">Skills & tools</h1>
          <p className="lede mt-6 max-w-[50ch]">
            Frontend, backend, databases and the tools I use day to day — drawn from my resume.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.id} className="rounded-card border border-line bg-panel p-6">
              <p className="label label--plain">{group.label}</p>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-fg/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell">
          <p className="label">Internship</p>
          <h2 className="display mt-4 text-2xl">NeST Digital Academy</h2>
          <p className="mt-2 font-mono text-[0.75rem] uppercase tracking-label text-rose">
            Frontend Web Application Developer — Internship
          </p>
          <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted">
            Developed a responsive web application using Angular, enhancing user engagement by X% through modern
            design and efficient coding practices.
          </p>
        </div>
      </section>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
