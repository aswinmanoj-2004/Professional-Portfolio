import { skillGroups } from '../data/portfolio';

/** Four labelled skill columns, used on the home page and skill pages. */
export default function TechStack({ compact = false }) {
  return (
    <section id="stack" className={compact ? 'py-4' : 'section'}>
      <div className="shell">
        {!compact && (
          <div data-reveal className="mb-8 flex items-end justify-between gap-6">
            <p className="label">The toolkit</p>
            <p className="hidden max-w-[30ch] font-mono text-[0.6875rem] uppercase tracking-label text-faint sm:block">
              What I actually build with
            </p>
          </div>
        )}

        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <div
              key={group.id}
              data-reveal
              data-reveal-delay={i * 0.07}
              className="group bg-panel p-6 transition-colors duration-500 hover:bg-panel2"
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-label text-clay">
                {String(i + 1).padStart(2, '0')} · {group.label}
              </p>
              <ul className="mt-5 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[0.9375rem] text-fg/90"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 flex-none rounded-full bg-ember/70 transition-transform duration-500 group-hover:scale-[1.6]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
