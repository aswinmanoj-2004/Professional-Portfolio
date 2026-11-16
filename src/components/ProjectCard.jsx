import { useRef, useState } from 'react';
import { resolveUrl } from '../data/portfolio';

/** Abstract placeholder artwork used until a real screenshot is dropped in. */
function MockArt({ label, tone = ['#2b2422', '#453734'] }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${tone[0]}, ${tone[1]})` }}
    >
      <div className="absolute inset-6 rounded-control border border-fg/10 bg-bg/25 p-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ember/70" />
          <span className="h-2 w-2 rounded-full bg-rose/40" />
          <span className="h-2 w-2 rounded-full bg-rose/25" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-2/3 rounded-full bg-fg/15" />
          <div className="h-2 w-5/6 rounded-full bg-fg/10" />
          <div className="h-2 w-1/2 rounded-full bg-fg/10" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-[4/3] rounded-[6px] bg-fg/[0.07]" />
          ))}
        </div>
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.5625rem] uppercase tracking-label text-fg/45">
        {label}
      </p>
    </div>
  );
}

export default function ProjectCard({ project, index, coarse, reduced }) {
  const rowRef = useRef(null);
  const [artBroken, setArtBroken] = useState(false);
  const isPlaceholder = project.status === 'placeholder';

  return (
    <article
      ref={rowRef}
      className="group relative border-t border-line py-8 transition-colors duration-500 hover:bg-panel/40 lg:py-10"
      data-reveal
      data-reveal-delay={index * 0.05}
    >
      <div className="shell grid gap-6 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-10">
        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-label text-clay">
            {String(index + 1).padStart(2, '0')} · {project.category}
          </p>
          <h3 className="display mt-3 text-[clamp(1.5rem,3.2vw,2.5rem)]">{project.title}</h3>
          <p className="mt-2 font-mono text-[0.75rem] uppercase tracking-label text-rose">
            {project.subtitle}
          </p>
        </div>

        <div>
          <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted">
            {project.description}
          </p>

          <ul className="mt-4 space-y-2">
            {project.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-fg/80">
                <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none rounded-full bg-ember" />
                {bullet}
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="chip !py-1 !px-3 text-[0.6875rem]">
                {tag}
              </li>
            ))}
          </ul>

          {/* inline media area (all viewports) */}
          <div className="mt-6 overflow-hidden rounded-card border border-line bg-panel">
            <div className="aspect-[16/9]">
              {!artBroken && project.screenshot ? (
                <img
                  src={project.screenshot}
                  alt={`Screenshot of ${project.title}`}
                  loading="lazy"
                  decoding="async"
                  onError={() => setArtBroken(true)}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]"
                />
              ) : (
                <MockArt label={isPlaceholder ? 'Screenshot coming soon' : project.subtitle} />
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isPlaceholder ? (
              <p className="font-mono text-[0.625rem] uppercase tracking-label text-faint">
                Case study in progress
              </p>
            ) : (
              <>
                <a
                  href={resolveUrl(project.live)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--solid !py-2.5 !px-4 text-[0.8125rem]"
                >
                  Visit live site <span className="btn__arrow">↗</span>
                </a>
                <a
                  href={resolveUrl(project.repo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>


    </article>
  );
}
