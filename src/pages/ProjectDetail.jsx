import { useParams, Link } from 'react-router-dom';
import { projects, profile, resolveUrl } from '../data/portfolio';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function ProjectDetail({ onContact }) {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <PageTransition reduced={false} delay={0}>
        <section className="section">
          <div className="shell">
            <p className="label">Not found</p>
            <h1 className="display mt-4 text-3xl">This project does not exist.</h1>
            <Link to="/" className="mt-6 inline-block text-ember">Back home</Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  const isPlaceholder = project.status === 'placeholder';

  return (
    <PageTransition reduced={false} delay={0}>
      <section className="section pt-4">
        <div className="shell">
          <p className="label">{project.category}</p>
          <h1 className="display mt-3 text-[clamp(2rem,5vw,4rem)]">{project.title}</h1>
          <p className="mt-2 font-mono text-[0.75rem] uppercase tracking-label text-rose">
            {project.subtitle}
          </p>

          <div className="mt-8 overflow-hidden rounded-card border border-line bg-panel">
            <div className="aspect-[16/9]">
              <img
                src={project.screenshot}
                alt={`Screenshot of ${project.title}`}
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          </div>

          <p className="mt-8 max-w-[60ch] text-[1rem] leading-relaxed text-muted">
            {project.description}
          </p>

          <ul className="mt-6 space-y-2">
            {project.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-fg/80">
                <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none rounded-full bg-ember" />
                {bullet}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="chip !py-1 !px-3 text-[0.6875rem]">
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!isPlaceholder && (
              <>
                <a
                  href={resolveUrl(project.live)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--solid !py-2.5 !px-4 text-[0.8125rem]"
                >
                  Visit live site
                </a>
                <a
                  href={resolveUrl(project.repo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
                >
                  Project GitHub
                </a>
              </>
            )}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
            >
              My GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
            >
              My LinkedIn
            </a>
          </div>
        </div>
      </section>
      <Footer lenisRef={{ current: null }} onContact={onContact} />
    </PageTransition>
  );
}
