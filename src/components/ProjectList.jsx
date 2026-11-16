import { projects as allProjects, skillPages } from '../data/portfolio';
import ProjectCard from './ProjectCard';

/** Vertical list of the projects tagged for one skill page. */
export default function ProjectList({ slug, coarse, reduced }) {
  const page = skillPages[slug];
  const list = allProjects.filter((project) => project.pages.includes(slug));

  return (
    <section id="work" className="section pt-4">
      <div className="shell">
        <div data-reveal className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <p className="label">{`${list.length} ${list.length === 1 ? 'build' : 'builds'} · ${page.title}`}</p>
          <p className="font-mono text-[0.625rem] uppercase tracking-label text-faint">
            Hover a row to preview
          </p>
        </div>
      </div>

      <div>
        {list.length ? (
          list.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} coarse={coarse} reduced={reduced} />
          ))
        ) : (
          <div className="shell">
            <p
              data-reveal
              className="rounded-card border border-dashed border-line bg-panel/50 p-8 text-center text-sm text-muted"
            >
              A case study for this skill is being written up. Drop it into
              <code className="mx-1 rounded bg-bg px-1.5 py-0.5 font-mono text-[0.75rem] text-rose">
                src/data/portfolio.js
              </code>
              and it appears here.
            </p>
          </div>
        )}
      </div>

      <div className="hairline mt-2" />
    </section>
  );
}
